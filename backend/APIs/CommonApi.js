import exp from "express";
export const commonRouter=exp.Router();
import {authenticate} from '../services/authservices.js';
import { UserModel } from "../Models/UserModel.js";
import bcrypt from 'bcryptjs';

const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
};
// login
commonRouter.post("/login",async(req,res)=>{
    try {
        let userCred=req.body;
        let {token,user}=await authenticate(userCred);
        //save token as http only cookie 
        res.cookie("token",token,cookieOptions)
        // send res 
        res.status(200).json({message:"Login successful",token,payload:user})
    } catch (err) {
        res.status(err.status || 500).json({message:err.message || "Login failed"})
    }
})
// logout
commonRouter.post("/logout",async(req,res)=>{
    res.clearCookie('token', cookieOptions)// must match original cookie options
  res.status(200).json({ message: 'Logout successful' })
})


// password change 

commonRouter.put("/change-password/:userId",async(req,res)=>{
    try {
        // get userId
        let userId=req.params.userId;
        // find user by userId
        let user=await UserModel.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        // get old password from body
        let oldPassword=req.body.oldPassword;
        // get new password 
        let newPassword=req.body.newPassword;
        // check if old password is correct or not
        if(bcrypt.compareSync(oldPassword,user.password)===true){
            // hash the new password before saving
            const hashedPassword = bcrypt.hashSync(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            res.status(200).json({message:"Password changed successfully"})
        }else{
            res.status(401).json({message:"Old password is incorrect"})
        }
    } catch (err) {
        res.status(500).json({message:"Error changing password",reason:err.message})
    }
})
