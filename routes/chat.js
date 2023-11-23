const express=require("express")
const router=express.Router()

const chatController=require("../controllers/chat")

router.post("/",chatController.postchat)
router.get("/chats",chatController.getChat)

module.exports=router