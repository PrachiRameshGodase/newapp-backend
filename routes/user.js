const express=require("express")
const router=express.Router()

const userController=require("../controllers/user")

router.post('/signup',userController.createAccount)
router.post("/login",userController.loginuser)

module.exports=router