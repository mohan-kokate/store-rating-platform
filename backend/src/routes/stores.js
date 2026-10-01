import { Router } from 'express';
import { pool } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { parse, storeSchema } from '../utils/validation.js';
const router=Router();
const sortMap={name:'s.name',address:'s.address',email:'s.email',rating:'overall_rating'};
function order(q){const field=sortMap[q.sort]||'s.name'; const dir=q.order==='desc'?'DESC':'ASC'; return `${field} ${dir}`;}
router.get('/',authenticate,async(req,res,next)=>{try{
 const search=(req.query.search||'').trim(); const values=[req.user.id]; let where=`WHERE 1=1`;
 if(search){values.push(`%${search}%`);where+=` AND (s.name ILIKE $${values.length} OR s.address ILIKE $${values.length})`;}
 const sql=`SELECT s.id,s.name,s.email,s.address,ROUND(COALESCE(AVG(r.rating),0),2)::float AS overall_rating,ur.rating AS user_rating FROM stores s LEFT JOIN ratings r ON r.store_id=s.id LEFT JOIN ratings ur ON ur.store_id=s.id AND ur.user_id=$1 ${where} GROUP BY s.id,ur.rating ORDER BY ${order(req.query)}`;
 const {rows}=await pool.query(sql,values); res.json({stores:rows});
}catch(e){next(e)}});
router.post('/',authenticate,authorize('ADMIN'),async(req,res,next)=>{try{
 const d=parse(storeSchema,req.body); const {rows}=await pool.query('INSERT INTO stores(name,email,address,owner_id) VALUES($1,$2,$3,$4) RETURNING id,name,email,address,owner_id',[d.name,d.email,d.address,d.ownerId||null]); res.status(201).json({store:rows[0]});
}catch(e){next(e)}});
export default router;
