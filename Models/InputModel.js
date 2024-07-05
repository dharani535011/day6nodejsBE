const mongoose=require("mongoose")



const InputSchema=new mongoose.Schema({
   
    url:String,
    random:String,
    createdat:{
        type:Date,
        default:Date.now
    },
    lengths:Number
})
const Inputs=mongoose.model("Inputs",InputSchema,"Inputs")
module.exports=Inputs