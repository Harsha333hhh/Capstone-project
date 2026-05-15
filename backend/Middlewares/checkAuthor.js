import { UserModel } from "../Models/UserModel.js";

export const checkAuthor=(req,res,next)=>{
// get author id
let authorId=req.body.author || req.params.authorId
// verify author 
if(!authorId || authorId.role!=="author"){
    return res.status(401).json({message:"Unauthorized"})
}
// forward req to next 
next();
};