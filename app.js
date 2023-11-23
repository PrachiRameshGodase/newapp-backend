const express = require("express");
const sequelize = require("./util/database");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

const http=require("http")
const socket=require('socket.io')
const server=http.createServer(app)
const io=new socket.Server(server,{cors:{origin:"*"}})

const user = require("./models/user");
const chat = require("./models/chat");
const Groups = require("./models/group");
const Usergroups = require("./models/usergroup");

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/group");


app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (token) {
    const decodedToken = jwt.verify(token, "Your-secret-key");
    const userId = decodedToken.userId;

    user
      .findByPk(userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  } else {
    next();
  }
});

io.on("connection",(socket)=>{
  console.log("A user connected :"+socket.id)



socket.on("sendMessage",async(data)=>{
  console.log(data)

  try{
    const User=await user.findByPk(data.userId)

    if(!User){
      console.log("User not found")
      return
    }

    const newMessage=await chat.create({
      message:data.message,
      userId:data.userId
    })

    const messageWithUser={
      message:newMessage.message,
      userId:newMessage.userId,
      id:newMessage.id,
      user:{
        name:user.name
      }
    }
    console.log("newMessage",messageWithUser)
     // Broadcast the new message with user to all connected clients
     io.emit("newMessage", messageWithUser);
  }catch(err){
    console.log(err)
  }
})
})
app.use("/", userRoutes);
app.use("/", chatRoutes);
app.use("/", groupRoutes);

user.hasMany(chat);
chat.belongsTo(user);

user.hasMany(Groups);
Groups.belongsTo(user);

Groups.hasMany(chat);
chat.belongsTo(Groups);

user.hasMany(Usergroups);
Usergroups.belongsTo(user);

Groups.hasMany(Usergroups);
Usergroups.belongsTo(Groups);

sequelize
  .sync()
  .then(() => {
    return user.findByPk(1);
  })
  .then((user) => {
    console.log(user);
    server.listen(process.env.PORT ||3000);
  })
  .catch((err) => {
    console.log(err);
  });
