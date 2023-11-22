const Groups = require("../models/group")

const user=require("../models/user")
const Usergroups = require("../models/usergroup")


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


const addmember=async(req,res)=>{
    console.log(req.body)
    try{
        const {phonenumber,groupId}=req.body
        //find the user based on the phonenumber
        const user=await user.findOne({
            where:{
                phonenumber:phonenumber
            }
        })

        if(!user){
            return res.user.status(404).json({error:"User not found"})
        }

        //find the group based on the groupId
        const group=await Groups.findBypk(groupId)

        if(!group){
            return res.status(404).json({error:"Group not found"})
        }

        //associate the user with the group in the usergroups false
        const usergroup=await Usergroups.create({
            userId:user.id,
            groupId:groupId
        })

        res.status(200).json({
            message:`${phonenumber} added to the group ${group.groupname}`,
            data:usergroup
        })
    }catch(err){
        res.status(500).json({err:err})
    }
}

module.exports={createGroup,addmember,getgroup}