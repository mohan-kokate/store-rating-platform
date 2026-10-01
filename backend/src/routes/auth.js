import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { parse, registerSchema, passwordSchema } from '../utils/validation.js';
const router=Router();
const tokenFor=u=>jwt.sign({id:u.id,role:u.role},process.env.JWT_SECRET,{expiresIn:'8h'});

router.post('/register',async(req,res,next)=>{try{
  const data=parse(registerSchema,req.body); const hash=await bcrypt.hash(data.password,12);
  const {rows} = await pool.query('INSERT INTO users(name,email,address,password_hash,role) VALUES($1,$2,$3,$4,\'USER\') RETURNING id,name,email,address,role',[data.name,data.email,data.address,hash]);
  res.status(201).json({user:rows[0],token:tokenFor(rows[0])});
}catch(e){next(e)}});
router.post('/login',async(req,res,next)=>{try{
  const {email,password}=req.body; if(!email||!password) return res.status(400).json({message:'Email and password are required'});
  const {rows}=await pool.query('SELECT * FROM users WHERE email=$1',[email]); const u=rows[0];
  if(!u || !(await bcrypt.compare(password,u.password_hash))) return res.status(401).json({message:'Invalid email or password'});
  const user={id:u.id,name:u.name,email:u.email,address:u.address,role:u.role}; res.json({user,token:tokenFor(user)});
}catch(e){next(e)}});
router.get('/me',authenticate,(req,res)=>res.json({user:req.user}));
router.put('/password',authenticate,async(req,res,next)=>{try{const {password}=parse(passwordSchema,req.body); const hash=await bcrypt.hash(password,12); await pool.query('UPDATE users SET password_hash=$1,updated_at=NOW() WHERE id=$2',[hash,req.user.id]); res.json({message:'Password updated'});}catch(e){next(e)}});
export default router;
