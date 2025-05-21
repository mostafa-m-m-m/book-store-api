const jwt = require('jsonwebtoken');

// verify token 

function verifyToken(req,res,next){
  const token = req.headers.token ;
  if(token){
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }catch(err){
      res.status(401).json({message:"invalid token"});
    }
  }else{
    res.status(401).json({message:"no token provided, authorization denied"});
  }
}

// Verfiy Token & Authorize the user

function verifyTokenAndAuthorization(req,res,next){
  verifyToken(req,res,()=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
      next();
    }else{
      res.status(403).json({message:"you are not allowed to do that"});
    }
  });
}

// Verfiy Token & Admin 

function verifyTokenAndAdmin(req,res,next){
  verifyToken(req,res,()=>{
    if(req.user.isAdmin){
      next();
    }else{
      res.status(403).json({message:"you are not allowed ,only admin can do that "});
    }
  });
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};