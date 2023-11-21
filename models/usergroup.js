const Sequelize=require("sequelize")
const sequelize=require("../util/database")

const Usergroups=sequelize.define("usergroups",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    }
})

module.exports=Usergroups