import express from 'express'
import { ArticleModel } from '../Models/ArticleModel.js';

export const articleRoute = express.Router()

// create articles
articleRoute.post('/articles',async(req,res)=>{
    try {
        // get articles from req
        let articleData=req.body;
        //check for author
        let authorId=req.user.userId;
        if(!authorId || req.user.role!=="author"){
            return res.status(401).json({message:"Unauthorized"})
        }
        // create article document 
        let article=new ArticleModel({...articleData,author:authorId});
        // save article 
        let createdarticle=await article.save();
        // send res
        res.status(201).json({message:"Article created successfully",payload:createdarticle})
    } catch (err) {
        res.status(500).json({message:"Error creating article",reason:err.message})
    }
})

// read all articles
articleRoute.get('/articles',async(req,res)=>{
    try {
        // read all articles 
        let articles = await ArticleModel.find({});
        // send res 
        res.status(200).json({message:"Articles retrieved successfully",payload:articles})
    } catch (err) {
        res.status(500).json({message:"Error retrieving articles",reason:err.message})
    }
})

// read articles by author
articleRoute.get('/articles/author/:authorId',async(req,res)=>{
    try {
        let authorId = req.params.authorId;
        if(!authorId){
            return res.status(400).json({message:"Author ID is required"})
        }
        // read articles by this author 
        let articles = await ArticleModel.find({author:authorId});
        // send res 
        res.status(200).json({message:"Articles retrieved successfully",payload:articles})
    } catch (err) {
        res.status(500).json({message:"Error retrieving articles",reason:err.message})
    }
})

// read articles of author which are active
articleRoute.get('/articles/active/:authorId',async(req,res)=>{
    try {
        let authId = req.params.authorId
        // read active articles by this author 
        let articles = await ArticleModel.find({author:authId,status:"active"});
        // send res 
        res.status(200).json({message:"Articles retrieved successfully",payload:articles}) 
    } catch (err) {
        res.status(500).json({message:"Error retrieving articles",reason:err.message})
    }
})

//update article
articleRoute.put('/articles/:articleId',async(req,res)=>{
    try {
        let articleId=req.params.articleId;
        let updateData=req.body;
        let authorId=req.user.userId;
        
        // find article and update
        let article=await ArticleModel.findByIdAndUpdate(articleId,updateData,{new:true});
        
        if(!article){
            return res.status(404).json({message:"Article not found"})
        }
        // send res 
        res.status(200).json({message:"Article updated successfully",payload:article})
    } catch (err) {
        res.status(500).json({message:"Error updating article",reason:err.message})
    }
})

// delete article
articleRoute.delete('/articles/:articleId',async(req,res)=>{
    try {
        let articleId=req.params.articleId;
        let authorId=req.user.userId;
        
        // find and delete article
        let article=await ArticleModel.findByIdAndDelete(articleId);
        
        if(!article){
            return res.status(404).json({message:"Article not found"})
        }
        // send res 
        res.status(200).json({message:"Article deleted successfully",payload:article})
    } catch (err) {
        res.status(500).json({message:"Error deleting article",reason:err.message})
    }
})


