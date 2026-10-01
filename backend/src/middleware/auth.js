import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

export async function authenticate(req,res,next){
  try {
    const header=req.headers.authorization;
    if(!header?.startsWith('Bearer ')) return res.status(401).json({message:'Authentication required'});
    const token=header.slice(7);
    const payload=jwt.verify(token,process.env.JWT_SECRET);
    const {rows}=await pool.query('SELECT id,name,email,address,role FROM users WHERE id=$1',[payload.id]);
    if(!rows[0]) return res.status(401).json({message:'User no longer exists'});
    req.user=rows[0]; next();
  } catch { return res.status(401).json({message:'Invalid or expired token'}); }
}
export const authorize=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'Forbidden'});
