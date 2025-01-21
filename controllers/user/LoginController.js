
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

const Login = async(req,res)=>{
    try{

        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({msg:"User not found "});
        }
        const isMatch = await bcrypt.compare(password,user.password)
      
        if(!isMatch)
        { return res.status(400).json({ message: "Invalid username or password" });
        }
        const token = jwt.sign({userId:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"1h"});

        res.json({ message: "Login successful", token,user });
    }catch(err)
    {
        res.status(500).json({ message: `Error registering user: ${err.message}` });

    }
}

export{Login}