import express from 'express'
import { register } from '../Controllers/userController.js'
import { authenticate } from '../services/authservices.js'
import { ArticleModel } from '../Models/ArticleModel.js'

export const userRoute = express.Router()

userRoute.post('/users', async (req, res, next) => {
  try {
    const userData = await register({ ...req.body, role: 'user' })
    res.status(201).json({ message: 'User registered successfully', user: userData })
  } catch (err) {
    next(err)
  }
})

// authenticate user 
//userRoute.post('/login', async (req, res, next) =>{ 
    // get user cred obj
  //  let userCred=req.body;
    // authenticate user and get token and user details
    //let {token,user}=await authenticate(userCred);
    //res.cookie("token",token,{httpOnly:true,sameSite:"lax",secure:true})
   // res.status(200).json({message:"Login successful",token,user})
//})
// read all articles (protected route)
userRoute.get('/articles',async(req,res)=>{
let articles=await ArticleModel.find({status:"active"}).populate('author','name email');
res.status(200).json({message:"the articles are",payload:articles});
})

// add comments to an article(protected route)
userRoute.post('/articles/:articleId/comments',async(req,res)=>{
let comment=req.body.comment;
let articleId=req.params.articleId;
let userId=req.user.userId;
// find article and update comments array
let article=await ArticleModel.findById(articleId);
if(!article){
  res.status(401).json({message:"article not found"});
}
article.comments.push({comment,user:userId});
await article.save();
res.status(201).json({message:"comments are added",payload:article});
})
