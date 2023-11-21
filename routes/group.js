const express=require("express")
const router=express.Router()
const groupController=require("../controllers/group")

router.post("/creategroup",groupController.createGroup)
module.exports=router