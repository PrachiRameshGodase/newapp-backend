const express=require('express')
const sequelize=require('./util/database')
const cors=require('cors')
const jwt = require("jsonwebtoken");

const user=require("./models/user")

const userRoutes=require('./routes/user')


const app=express()
app.use(express.json())
app.use(cors());
app.use((req,res,next)=>{
    const token=req.headers.authorization
    console.log(token)
    if(token){
        const decodedToken=jwt.verify(token,"Your-secret-key")
        const userId=decodedToken.userId

        user.findByPk(userId).then((user)=>{
            req.user=user
            next()
        }).catch((err)=>{
            console.log(err)
            next()
        })
    }else{
        next()
    }
})

app.use("/",userRoutes)

sequelize.sync()
    .then(() => {
        return user.findByPk(1);
    })
    .then((user) => {
        console.log(user);
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
