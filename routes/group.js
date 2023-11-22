const express=require("express")
const router=express.Router()
const groupController=require("../controllers/group")

router.post("/creategroup",groupController.createGroup)
router.get("/admingroups",groupController.getgroup)

router.post("/",groupController.addmember)
module.exports=router