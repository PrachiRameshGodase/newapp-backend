const Chat=require("../models/chat")
const user=require("../models/user")


const postchat = async (io, socket, data) => {
    console.log(data);
  
    try {
      // Assuming user and chat are defined elsewhere
      const User = await user.findByPk(data.userId);
  
      if (!User) {
        console.log("User not found");
        return;
      }
  
      const newMessage = await Chat.create({
        message: data.message,
        userId: data.userId,
      });
  
      const messageWithUser = {
        message: newMessage.message,
        userId: newMessage.userId,
        id: newMessage.id,
        user: {
          name: User.name,
        },
      };
  
      console.log("newMessage", messageWithUser);
  
      // Broadcast the new message with user to all connected clients
      io.emit("newMessage", messageWithUser);
    } catch (err) {
      console.log(err);
    }
  };
  
  module.exports = postchat;
  

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