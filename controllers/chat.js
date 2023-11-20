const Chat=require("../models/chat")


const postchat=async(req,res)=>{
    console.log(req.body)
    try{
        if(!req.user){
            res.status(401).json({error:"Invalid User"})
        }

        const {message}=req.body;
        const newChat=await Chat.create(
            {
                userId:req.user.id,
                message:message
            }
        )
        res.status(201).json({data:newChat})
    }catch(err){
        console.log(err)
        res.status(500).json({err:"Error in post the chat"})
    }
}

const getChat=async(req,res)=>{
    console.log(req.body)
    try{
        const message=await Chat.findAll({
            attributes:["message","userId","id"],
            include:[{model:User,atrributes:["name"]}]
        })
        res.status(201).json({data:message})

    }catch(err){
        console.log(err)
        res.status(500).json({err:err})
    }
}

module.exports={
    postchat,getChat
}