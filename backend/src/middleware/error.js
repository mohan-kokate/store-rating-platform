export function notFound(req,res){res.status(404).json({message:'Route not found'});}
export function errorHandler(err,req,res,next){
  console.error(err);
  if(err.code==='23505') return res.status(409).json({message:'A record with that unique value already exists'});
  if(err.code==='23503') return res.status(400).json({message:'Referenced record does not exist'});
  res.status(err.status||500).json({message:err.status?err.message:'Internal server error'});
}
