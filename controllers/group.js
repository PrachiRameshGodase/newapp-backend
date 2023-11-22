const Groups = require("../models/group")
const user=require("../models/user")


const createGroup=async(req,res)=>{
    console.log("createGroupsssssssss created")
    console.log(req.body)
    try{
        const {groupname}=req.body
        const userId=req.user.id
        const phonenumber=req.user.phonenumber

        const group=await Groups.create({
            groupname:groupname,
            phonenumber:phonenumber
        })

        //associate the user with the created group
        await group.setUser(userId)
        console.log(group)
        res.status(201).json({data:group})
    }catch(err){
        res.status(500).json({err:err})
    }
}

const getgroup=async(req,res)=>{
    console.log("getgroup calledddddddddd")
    try{
if(!req.user){
    return res.status(401).json({err:"Invalid User"})
}

const userId=req.user.id

//retrieve group names where userid matches

const groups=await Groups.findAll({
    attributes:["groupname","id"],
    where:{
        userId:userId
    }
})
console.log(groups)
res.status(200).json({data:groups})

    }catch(err){
        console.log(err)
        res.status(500).json({err:err})
    }
}

module.exports={createGroup,getgroup}