const mongoose=require("mongoose")



const UserSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    status:{type:String,default:"inactive"},
    randomstring:String
})
const Users=mongoose.model("Users",UserSchema,"Users")
module.exports=Users