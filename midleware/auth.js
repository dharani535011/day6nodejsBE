const { SECRETKEY } = require("../config/UserConfig")
const jwt =require("jsonwebtoken")

const auth={
      verified:async(req,res,next)=>{
        try{
          const token=req.cookies.token
          if(!token){
            return res.send({ message: 'Access denied' })
          }
          const decodedtoken=jwt.verify(token,SECRETKEY)
          req.userid=decodedtoken.id
          next()
        }catch(e){
            res.send(e.message)
        }
      }
}
module.exports=auth