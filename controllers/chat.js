const Chat=require("../models/chat")
const user=require("../models/user")
const http=require("http")
// const socket=require("socket.io")
// const server=http.createServer(app)
// const io=new socket.Server(server,{cors:{origin:"*"}})

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

const getChat = async (req, res) => {
    console.log(req.body);
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Invalid User" });
        }

        const message = await Chat.findAll({
            attributes: ["message", "userId", "id"],
            include: [{ model: user, attributes: ["name"] }],
        });

        console.log(message);
        return res.status(200).json({ data: message });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports={
    postchat,getChat
}