const express=require("express")
const router=express.Router()

const chatController=require("../controllers/chat")

router.post("/chats",chatController.postchat)
router.get("/getAllmessage",chatController.getChat)

module.exports=router