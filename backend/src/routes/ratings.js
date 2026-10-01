import { Router } from 'express';
import { pool } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { parse, ratingSchema } from '../utils/validation.js';
const router=Router();
router.post('/',authenticate,authorize('USER'),async(req,res,next)=>{try{
 const d=parse(ratingSchema,req.body); const {rows}=await pool.query('INSERT INTO ratings(store_id,user_id,rating) VALUES($1,$2,$3) RETURNING id,store_id,rating,created_at,updated_at',[d.storeId,req.user.id,d.rating]); res.status(201).json({rating:rows[0]});
}catch(e){next(e)}});
router.put('/:storeId',authenticate,authorize('USER'),async(req,res,next)=>{try{
 const d=parse(ratingSchema,{storeId:Number(req.params.storeId),rating:req.body.rating}); const {rows}=await pool.query('UPDATE ratings SET rating=$1,updated_at=NOW() WHERE store_id=$2 AND user_id=$3 RETURNING id,store_id,rating,updated_at',[d.rating,d.storeId,req.user.id]); if(!rows[0]) return res.status(404).json({message:'You have not rated this store yet'}); res.json({rating:rows[0]});
}catch(e){next(e)}});
export default router;
