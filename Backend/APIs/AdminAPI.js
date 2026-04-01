import exp from 'express'
import { UserTypeModel } from '../Models/UserModel.js';
export const  adminRoute=exp.Router()
//Read all articles
//Block user
adminRoute.post("/BlockedUsers",async(req,res)=>{
    //get userId from req body
    let userId=req.body.userId;
    //find user by id
    let user=await UserTypeModel.findById(userId);  
    if(!user){
        const err=new Error("User not found");
        err.status=404;
        throw err;
    }
    //check isActive state
    if(user.isActive===false){
        const err=new Error("User is already blocked. Please contact admin");
        err.status=403;
        throw err;
    }
    //update user isActive to false
    let updatedUser=await UserTypeModel.findByIdAndUpdate(userId,{isActive:false},{new:true}).select("-password");
    //send res
    res.status(200).json({message:"User blocked",payload:updatedUser})
});
//unblock user 
adminRoute.put("/unblock/:userId",async(req,res)=>{
    //get userId from req params
    let userId=req.params.userId;
    //update user isActive to true
    let updatedUser=await UserTypeModel.findByIdAndUpdate(userId,{isActive:true},{new:true}).select("-password");
    //send res
    res.status(200).json({message:"User unblocked",payload:updatedUser})
})