const express=require("express")
const UserController = require("../Controllers/UserController")
const auth = require("../midleware/auth")
const UserRouter=express.Router()

UserRouter.post("/signup",UserController.CreateUser)
UserRouter.post("/checklogin",UserController.checklogin)
UserRouter.post("/login",UserController.login)
UserRouter.post("/activate",UserController.activate)
UserRouter.post("/forgetpassword",UserController.fogetpassword)
UserRouter.post("/resetpassword",UserController.resetpassword)
UserRouter.post("/logout",auth.verified,UserController.logout)
module.exports=UserRouter