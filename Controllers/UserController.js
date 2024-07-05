const Users = require("../Models/UserModel")
const bcrypt=require("bcrypt")
const crypto=require("crypto")
const jwt =require("jsonwebtoken")
const nodemailer=require("nodemailer")
const { SECRETKEY, PASSWORD } = require("../config/UserConfig")
const UserController={
    CreateUser:async(req,res)=>{
        const {firstname,lastname,email,password}=req.body
        try{
            if(!firstname||!lastname||!email||!password){
              return  res.send({message:"missing values!"})
            }
            const findemail=await Users.findOne({email})
            if(findemail){
               return res.send({message:"user is already exists"})
            }
            const newpassword=await bcrypt.hash(password,10)
            const users=new Users({firstname,lastname,email,password:newpassword})
            await users.save()
            let transport=nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:"dharani535011@gmail.com",
                    pass:PASSWORD
                }
            })
            let mailoption={
                from:"dharani535011@gmail.com",
                to:users.email,
                subject:"Active your shortenUrl account",
                text:`here's the link to activate your account ${"https://keen-kitsune-e0ca79.netlify.app/activate"} `
            }
            await transport.sendMail(mailoption)
            res.send({message:"user created successfully, active your account via Email"})
        }catch(e){
            res.send(e.message)
        }
    },
    login:async(req,res)=>{
        const {email,password}=req.body
        try{
            if(!email||!password){
                return  res.send({message:"missing values!"})
              }
            const isactive=await Users.findOne({email})
              if(isactive.status=="inactive"){
                return  res.send({message:"please activate your account via email"})
              }  
            const ispassword=await bcrypt.compare(password,isactive.password)  
            if(!ispassword){
                return res.send({message:"incorrect password"})
             }
             const token=jwt.sign({id:isactive._id},SECRETKEY)
             res.cookie("token",token,{
                httpOnly:true,
                secure:true,
                sameSite:"none",
                expires:new Date(Date.now()+24*3600000)
             })
             res.send({message:"login successfully"})
        }catch(e){
            res.send(e.message)
        }
    },
    activate:async(req,res)=>{
        const {email}=req.body
        try{
            if(!email){
                return  res.send({message:"please enter your email!"})
              }
              const isactive=await Users.findOne({email})
              if(!isactive){
                return  res.send({message:"invalid email!"})
              }
              isactive.status="active"
              await isactive.save()
              res.send({message:"account activated successfully"})
        }catch(e){
            res.send(e.message)
        }
    },
    logout:(req,res)=>{
        try{
            res.clearCookie('token');
          res.json({message:"logout successfully"})
        }catch(e){
            res.send(e.message)
        }
    },
    fogetpassword:async(req,res)=>{
        try{
           const {email}=req.body
           const user=await Users.findOne({email})
           if(!user){
          return  res.json({message:"user is not found"})
           }
           const randomstrings=crypto.randomBytes(6).toString("hex").slice(0,6)
           user.randomstring=randomstrings
           await user.save()
           let transport=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"dharani535011@gmail.com",
                pass:PASSWORD
            }
           })
           await transport.sendMail({
            from:"dharani535011@gmail.com",
            to:user.email,
            subject:"password reset OTP",
            text:`change your password to use this otp : ${randomstrings}
            here's the link to reset your password  ${"https://keen-kitsune-e0ca79.netlify.app/reset"}`
           })
           res.send({message:"OTP send to your mail.."})
        }catch(e){
            res.send(e.message)
        }
    },
    resetpassword:async(req,res)=>{
        try{
             const {otp,password,repass}=req.body
             if(!otp||!password||!repass){
                return res.send({message:"fill all inputs properly"})
             }
             const user=await Users.findOne({randomstring:otp})
             if(!user){
               return res.send({message:"worng OTP"})
             }
             if(password!==repass){
                return res.send({message:"enter the same password in inputs"})
             }

             const newpass=await bcrypt.hash(password,10)
             user.password=newpass
             user.randomstring=""
             await user.save()

             res.send({message:"password changed"})
             
        }catch(e){
            res.send(e.message)
        }
    },
    checklogin:async(req,res)=>{
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.send("login please")
            }
            jwt.verify(token, SECRETKEY, (err, decoded) => {
                if (err) {
                    return res.send("token incorrect")
                }
                res.send({message:"okk"})
            });
        } catch (e) {
            res.sendStatus(401)
        }
    }
}
module.exports=UserController