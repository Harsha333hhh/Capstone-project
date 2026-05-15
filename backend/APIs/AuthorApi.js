import express from 'express'
import { register } from '../Controllers/userController.js'
import { ArticleModel } from '../Models/ArticleModel.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
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

// create articles(protected route)
authorRoute.post('/articles', authMiddleware, async(req,res)=>{
    try {
        let articleData=req.body;
        let authorId=req.user.userId;
        if(!authorId || req.user.role!=="author"){
            return res.status(401).json({message:"Unauthorized"})
        }
        let article=new ArticleModel({...articleData,author:authorId});
        let createdarticle=await article.save();
        res.status(201).json({message:"Article created successfully",payload:createdarticle})
    } catch(err) {
        res.status(500).json({message:"Error creating article",reason:err.message})
    }
})

// read articles of author
authorRoute.get('/articles', authMiddleware, async(req,res)=>{
    try {
        let authorId=req.user.userId;
        if(!authorId || req.user.role!=="author"){
            return res.status(401).json({message:"Unauthorized"})
        }
        let articles = await ArticleModel.find({author:authorId}).populate('author','name email').populate('comments.user','name email');
        res.status(200).json({message:"Articles retrieved successfully",payload:articles})
    } catch(err) {
        res.status(500).json({message:"Error retrieving articles",reason:err.message})
    }
})

// read active articles of author(protected route)
authorRoute.get('/articles/active', authMiddleware, async(req,res)=>{
    try {
        let authorId=req.user.userId;
        if(!authorId || req.user.role!=="author"){
            return res.status(401).json({message:"Unauthorized"})
        }
        let articles = await ArticleModel.find({author:authorId,status:"active"});
        res.status(200).json({message:"Articles retrieved successfully",payload:articles})
    } catch(err) {
        res.status(500).json({message:"Error retrieving articles",reason:err.message})
    }
})

// edit article (protected route)
authorRoute.put('/articles/:articleId', authMiddleware, async(req,res)=>{
    try {
        let updateData=req.body;
        let articleId=req.params.articleId;
        let article=await ArticleModel.findByIdAndUpdate(articleId,updateData,{new:true});
        if(!article){
            return res.status(404).json({message:"Article not found"})
        }
        res.status(200).json({message:"Article updated successfully",payload:article})
    } catch(err) {
        res.status(500).json({message:"Error updating article",reason:err.message})
    }
})

// delete articles(protected route)
authorRoute.delete('/articles/:articleId', authMiddleware, async(req,res)=>{
    try {
        let articleId=req.params.articleId;
        let article=await ArticleModel.findByIdAndDelete(articleId);
        if(!article){
            return res.status(404).json({message:"Article not found"})
        }
        res.status(200).json({message:"Article deleted successfully",payload:article})
    } catch(err) {
        res.status(500).json({message:"Error deleting article",reason:err.message})
    }
})
