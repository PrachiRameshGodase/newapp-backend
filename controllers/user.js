const User=require("../models/user")
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")



const createAccount = async (req, res) => {
    console.log(req.body);

    const { name, email, password, phonenumber } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // hashing password
        const hashPassword = await bcrypt.hash(password, 10);
        // creating a new user with the hashed password
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            phonenumber,
        });

        // generate a JWT token for the new user
        const token = jwt.sign(
            { userId: newUser.id, name: newUser.name },
            "Your-secret-key"
        );
        res.json({ token, userId: newUser.id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Failed to create user" });
    }
};

const loginuser=async(req,res)=>{
    console.log(req.body)
    const {email,password}=req.body
    try{
        //find the user in the database
        const user=await User.findOne({where:{email}})

        if(!user){
            return res.status(401).json({error:"Invalid email"})
        }

        const result=await bcrypt.compare(password,user.password)
        if(!result){
            return res.status(401).json({error:"Invalid password"})
        }

        //genertate JWT token
        const token=jwt.sign({
            userId:user.id,name:user.name
        },"Your-secret-key")

        res.json({token,userId:user.id})
    }catch(err){
        console.log(err)
        res.status(500).json({error:"error during login"})
    }
}
module.exports={
    createAccount,
    loginuser
}