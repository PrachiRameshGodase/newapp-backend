const Sequelize=require('sequelize')

const sequelize=new Sequelize('chat-app','root','Prachi@123',{
    dialect:'mysql',
    host:"localhost"
})

module.exports=sequelize;
