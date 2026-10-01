import bcrypt from 'bcryptjs';
import { pool } from './db.js';
const run=async()=>{
 const users=[
  ['System Administrator Account','admin@example.com','Admin Address, Pune','Admin@123','ADMIN'],
  ['Demo Store Owner Account','owner@example.com','Owner Address, Pune','Owner@123','OWNER'],
  ['Demo Normal User Account','user@example.com','User Address, Pune','User@123','USER'],
  ['Second Demo Normal User','user2@example.com','Second User Address, Pune','User@123','USER']
 ];
 const ids={};
 for(const [name,email,address,password,role] of users){const hash=await bcrypt.hash(password,12);const {rows}=await pool.query(`INSERT INTO users(name,email,address,password_hash,role) VALUES($1,$2,$3,$4,$5) ON CONFLICT(email) DO UPDATE SET name=EXCLUDED.name,address=EXCLUDED.address,role=EXCLUDED.role RETURNING id`,[name,email,address,hash,role]);ids[email]=rows[0].id;}
 const s=await pool.query(`INSERT INTO stores(name,email,address,owner_id) VALUES($1,$2,$3,$4) ON CONFLICT(email) DO UPDATE SET owner_id=EXCLUDED.owner_id RETURNING id`,['Demo Technology Store','store@example.com','Demo Store Address, Pune',ids['owner@example.com']]);
 await pool.query(`INSERT INTO ratings(store_id,user_id,rating) VALUES($1,$2,5) ON CONFLICT(store_id,user_id) DO UPDATE SET rating=5`,[s.rows[0].id,ids['user@example.com']]);
 await pool.query(`INSERT INTO ratings(store_id,user_id,rating) VALUES($1,$2,4) ON CONFLICT(store_id,user_id) DO UPDATE SET rating=4`,[s.rows[0].id,ids['user2@example.com']]);
 console.log('Seed complete. Demo accounts are documented in README.');await pool.end();
};run().catch(e=>{console.error(e);process.exit(1)});
