const Sequelize=require("sequelize")

const sequelize=require("../util/database")

const user=sequelize.define("user",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    phonenumber:{
        type:Sequelize.DOUBLE,
        allowNull:false
    }
})

module.exports=user;