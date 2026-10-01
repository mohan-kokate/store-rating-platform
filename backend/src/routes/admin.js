import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { parse, adminUserSchema, storeSchema } from '../utils/validation.js';
const router=Router();
router.use(authenticate,authorize('ADMIN'));
const safeUser='id,name,email,address,role,created_at';
const like=(v,n)=>{const a=(v||'').trim();return a?[`%${a}%`,n]:null};
router.get('/stats',async(req,res,next)=>{try{const {rows}=await pool.query(`SELECT (SELECT COUNT(*) FROM users)::int users,(SELECT COUNT(*) FROM stores)::int stores,(SELECT COUNT(*) FROM ratings)::int ratings`);res.json(rows[0]);}catch(e){next(e)}});
router.get('/users',async(req,res,next)=>{try{
 const vals=[];let where='WHERE 1=1';
 for(const [key,col] of [['name','name'],['email','email'],['address','address'],['role','role']]){if(req.query[key]){vals.push(`%${req.query[key].trim()}%`);where+=` AND ${col}::text ILIKE $${vals.length}`;}}
 const sort={name:'name',email:'email',address:'address',role:'role'}[req.query.sort]||'name';const dir=req.query.order==='desc'?'DESC':'ASC';
 const {rows}=await pool.query(`SELECT ${safeUser} FROM users ${where} ORDER BY ${sort} ${dir}`,vals);res.json({users:rows});
}catch(e){next(e)}});
router.post('/users',async(req,res,next)=>{try{const d=parse(adminUserSchema,req.body);const hash=await bcrypt.hash(d.password,12);const {rows}=await pool.query(`INSERT INTO users(name,email,address,password_hash,role) VALUES($1,$2,$3,$4,$5) RETURNING ${safeUser}`,[d.name,d.email,d.address,hash,d.role]);res.status(201).json({user:rows[0]});}catch(e){next(e)}});
router.get('/users/:id',async(req,res,next)=>{try{const {rows}=await pool.query(`SELECT ${safeUser} FROM users WHERE id=$1`,[req.params.id]);if(!rows[0])return res.status(404).json({message:'User not found'});let u=rows[0];if(u.role==='OWNER'){const x=await pool.query(`SELECT s.id,s.name,s.email,s.address,ROUND(COALESCE(AVG(r.rating),0),2)::float AS rating FROM stores s LEFT JOIN ratings r ON r.store_id=s.id WHERE s.owner_id=$1 GROUP BY s.id`,[u.id]);u={...u,stores:x.rows};}res.json({user:u});}catch(e){next(e)}});
router.get('/stores',async(req,res,next)=>{try{const vals=[];let where='WHERE 1=1';for(const [key,col] of [['name','s.name'],['email','s.email'],['address','s.address']])if(req.query[key]){vals.push(`%${req.query[key].trim()}%`);where+=` AND ${col} ILIKE $${vals.length}`;}const sort={name:'s.name',email:'s.email',address:'s.address',rating:'overall_rating'}[req.query.sort]||'s.name';const dir=req.query.order==='desc'?'DESC':'ASC';const {rows}=await pool.query(`SELECT s.id,s.name,s.email,s.address,ROUND(COALESCE(AVG(r.rating),0),2)::float AS overall_rating,s.owner_id FROM stores s LEFT JOIN ratings r ON r.store_id=s.id ${where} GROUP BY s.id ORDER BY ${sort} ${dir}`,vals);res.json({stores:rows});}catch(e){next(e)}});
export default router;
