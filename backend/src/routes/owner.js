import { Router } from 'express';
import { pool } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router=Router();
router.get('/dashboard',authenticate,authorize('OWNER'),async(req,res,next)=>{try{
 const store=await pool.query(`SELECT s.id,s.name,s.email,s.address,ROUND(COALESCE(AVG(r.rating),0),2)::float AS average_rating,COUNT(r.id)::int AS rating_count FROM stores s LEFT JOIN ratings r ON r.store_id=s.id WHERE s.owner_id=$1 GROUP BY s.id`,[req.user.id]);
 if(!store.rows[0]) return res.status(404).json({message:'No store is assigned to this owner'});
 const ratings=await pool.query(`SELECT u.id,u.name,u.email,u.address,r.rating,r.updated_at FROM ratings r JOIN users u ON u.id=r.user_id WHERE r.store_id=$1 ORDER BY r.updated_at DESC`,[store.rows[0].id]);
 res.json({store:store.rows[0],ratings:ratings.rows});
}catch(e){next(e)}});
export default router;
