// create admin

import express from 'express'
import { register } from '../Controllers/userController.js'
import {UserModel} from '../Models/UserModel.js'

export const adminRoute = express.Router()

// admin is not going to register himself so we are not creating a public route for admin registration
// we can create admin from database directly or we can create a protected route for creating admin which can be accessed by existing admin only
// for simplicity we are creating a public route for admin registration but in real world we should not do this
// becouse in real wolrd admin is assigned by the organization and not created by himself
//adminRoute.post("/users",async(req,res,next)=>{
  //  try{
    //    const userData=await register({...req.body, role:'admin'});
     //   res.status(201).json({message:"Admin registered successfully",user:userData});
    //}catch(err){
    //    next(err);}})

// now we have created admin manually in mangodb databsee 
// and now we have to use that admin to either block or unblock the users 

//this is the admin which we have created manually in database
//* Paste one or more documents here
//*/
//{
 // "name": "admin",
  //"role": "admin",
  //"email": "admin@mail.com",
  //"password": "$2a$12$Ufl2hcsyLyJRDX7CS79Iqeit7YzcBONZTD5HHbDpQNpZiwsIdb6zy"
//}
//read all articles(optional)

// block users
adminRoute.post("/block-user/:userId",async(req,res)=>{
    let userId=req.params.userId;
    // find user and update status to blocked
    let user=await UserModel.findByIdAndUpdate(userId,{status:"blocked"},{new:true});
    if(!user){
        res.status(401).json({message:"user not found"});
    }
    res.json({message:"the user is blocked successfully"})
    res.json({message:"user status is updated to blocked",payload:user})
})

//unblock users 
adminRoute.post("/activate-user/:userId",async(req,res)=>{
    let userId=req.params.userId;
    // find user and activate his status
    let user=await UserModel.findByIdAndUpdate(userId,{status:"active"},{new:true});
    if(!user){
        res.status(401).json({message:"user not found"});
    }
    res.json({message:"user status is updated to active status",payload:user})
})


