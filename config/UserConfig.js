require("dotenv").config()
const MONGODB=process.env.MONGODB
const SECRETKEY=process.env.SECRETKEY
const PASSWORD=process.env.PASSWORD

module.exports={
    MONGODB,SECRETKEY,PASSWORD
}