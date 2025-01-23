
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

const SignUp = async(req,res)=>{
    try{

        const {role,email,name,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({msg:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            role,name,email,password:hashedPassword
        })
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    }catch(err)
    {
        res.status(500).json({ message: `Error registering user: ${err.message}` });

    }
}

export {SignUp};