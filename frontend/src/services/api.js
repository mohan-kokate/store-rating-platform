import axios from 'axios';
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api'});
api.interceptors.request.use(c=>{const t=localStorage.getItem('token');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
export function saveSession(data){localStorage.setItem('token',data.token);localStorage.setItem('user',JSON.stringify(data.user));}
export function clearSession(){localStorage.removeItem('token');localStorage.removeItem('user');}
export function sessionUser(){try{return JSON.parse(localStorage.getItem('user'))}catch{return null}}
