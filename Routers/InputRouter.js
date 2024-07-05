const express=require("express")
const InputController = require("../Controllers/InputController")
const auth = require("../midleware/auth")
const InputRouter=express.Router()

InputRouter.post("/url",InputController.createinput)
InputRouter.get("/urls",InputController.getvalues)
InputRouter.get("/:random",InputController.getvalue)

module.exports=InputRouter