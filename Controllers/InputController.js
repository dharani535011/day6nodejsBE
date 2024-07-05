const Inputs = require("../Models/InputModel")
const crypto=require("crypto")
const InputController={
  createinput:async(req,res)=>{
    const {url}=req.body
    try{ 
        if(!url){
            return res.send({message:"enter valid inputs"})
        }
        const isurl=await Inputs.findOne({url})
        if(isurl){
            return res.send({message:"url is already exists"})
        }
        const no=await Inputs.find()
        let lengths=no.length?no.length+1:1
        const rantomstring=crypto.randomBytes(6).toString("hex").slice(0,6)
        const newurl=new Inputs({url,random:rantomstring,lengths})
        await newurl.save();
        res.send({message:newurl.random})
    }catch(e){
        res.send(e.message)
    }
},
  getvalue:async(req,res)=>{
    const {random}=req.params
    try{
        const inputValue = await Inputs.findOne({ random });
        if (!inputValue) {
            return res.status(404).send({ message: "Value not found" });
          }
          res.redirect(inputValue.url);
    }catch(e){
        res.send(e.message)
    }
  }  ,
  getvalues:async(req,res)=>{
    try{
       const urls=await Inputs.find({}, { _id: 0, random: 1,createdat:1,lengths:1 })
       res.send(urls)
    }catch(e){
        res.sen(e.message)
    }
  }
}
module.exports=InputController
