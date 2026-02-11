import express from 'express'
import { register } from '../Controllers/userController.js'
import { authenticate } from '../services/authservices.js'
import { checkAuthor } from '../Middlewares/checkAuthor.js';
import { ArticleModel } from '../Models/ArticleModel.js';
import { verifyToken } from '../Middlewares/verifyToken.js';
export const authorRoute = express.Router()

// register author (public)
authorRoute.post("/users",async(req,res,next)=>{
    try{
        const userData=await register({...req.body, role:'author'});
        res.status(201).json({message:"Author registered successfully",user:userData});
    }catch(err){
        next(err);
    }

})
// authenticate author
//authorRoute.post('/login', async (req, res, next) =>{ 
  //  let userCred=req.body;
   // let {token,user}=await authenticate(userCred);
    //res.cookie("token",token,{httpOnly:true,sameSite:"lax",secure:true})
    //res.status(200).json({message:"Login successful",token,payload:user})
//})

// create articles(protected route)
authorRoute.post('/articles',checkAuthor,async(req,res)=>{
    // get articles from req
    let articleData=req.body;
    //check for author
    let authorId=req.user.userId;
    if(!authorId || authorId.role!=="author"){
        return res.status(401).json({message:"Unauthorized"})
    }
    // create article document 
    let article=new ArticleModel({...articleData,author:authorId});
    // save article 
    let createdarticle=await article.save();
    // send res
    res.status(201).json({message:"Article created successfully",payload:createdarticle})
})

// read articles of author
authorRoute.get('/articles',checkAuthor,verifyToken,async(req,res)=>{
    //get author id 
    let authorId=req.user.userId;
    // chech for author
    if(!authorId || authorId.role!=="author"){
        return res.status(401).json({message:"Unauthorized"})
    }
    // read articles by this author 
    let articles =await ArticleModel.find({author:authorId});
    // send res 
    res.status(200).json({message:"Articles retrieved successfully",payload:articles})
})

//read articles of author which are active(protected route)
authorRoute.get('/articles/active',checkAuthor,async(req,res)=>{

    // get user id 
    let authId=req.params.authorId
    // chech for author
    if(!authId || authId.role!=="author"){
        return res.status(401).json({message:"Unauthorized"})
    }
    // read active articles by this author 
    let articles =await ArticleModel.find({author:authId,status:"active"});
    // send res 
    res.status(200).json({message:"Articles retrieved successfully",payload:articles}) 
})

//delete articles of author

//edit article (protected route )
authorRoute.put('/articles/:articleId',checkAuthor,async(req,res)=>{
    // get modified article from req 
    let updatedData=req.body;
    // get article id from params 
    let articleId=req.params.articleId;
    // get user id from req 
    let userId=req.user.userId;
// update the acrticle 
    // find and update article
    let article=await ArticleModel.findByIdAndUpdate(articleId,updateData,{new:true});
    
    if(!article){
        return res.status(404).json({message:"Article not found"})
    }
    // send res (updated article)
    res.status(200).json({message:"Article updated successfully",payload:article})
})

// delete articles(protected route)
  authorRoute.delete('/articles/:articleId',checkAuthor,async(req,res)=>{
            let articleId=req.params.articleId;
            let userid=req.user.userId;
            let article=await ArticleModel.findByIdAndUpdate(articleId);
            if(!article){
                res.status(401).json({message:"the article does not exist"})
            }
            res.status(200).json({message:"article is deleted",pauload:article})
        })
