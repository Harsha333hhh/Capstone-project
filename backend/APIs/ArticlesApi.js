import express from 'express'
import { ArticleModel } from '../Models/ArticleModel.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

export const articleRoute = express.Router()

// create articles - PROTECTED
articleRoute.post('/articles', authMiddleware, async(req,res)=>{
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

// read all articles - PUBLIC
articleRoute.get('/articles',async(req,res)=>{
    try {
        // read all articles and populate author and comment users
        let articles = await ArticleModel.find({}).populate('author','name email').populate('comments.user','name email');
        
        // DEBUG: Log first article's comments structure
        if(articles.length > 0) {
            console.log('\n=== GET /ARTICLES DEBUG ===');
            console.log('First article comments:', JSON.stringify(articles[0].comments, null, 2));
            console.log('===========================\n');
        }
        
        // send res 
        res.status(200).json({message:"Articles retrieved successfully",payload:articles})
    } catch (err) {
        res.status(500).json({message:"Error retrieving articles",reason:err.message})
    }
})

// read articles by author - PUBLIC
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

// read articles of author which are active - PUBLIC
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

//update article - PROTECTED
articleRoute.put('/articles/:articleId', authMiddleware, async(req,res)=>{
    try {
        let articleId=req.params.articleId;
        let updateData=req.body;
        let authorId=req.user.userId;
        
        // find article first
        let article=await ArticleModel.findById(articleId);
        
        if(!article){
            return res.status(404).json({message:"Article not found"})
        }
        
        // check if the current user is the author
        if(article.author.toString() !== authorId){
            return res.status(403).json({message:"Unauthorized: Only the article author can update this article"})
        }
        
        // update article
        let updatedArticle=await ArticleModel.findByIdAndUpdate(articleId,updateData,{new:true});
        
        // send res 
        res.status(200).json({message:"Article updated successfully",payload:updatedArticle})
    } catch (err) {
        res.status(500).json({message:"Error updating article",reason:err.message})
    }
})

// delete article - PROTECTED
articleRoute.delete('/articles/:articleId', authMiddleware, async(req,res)=>{
    try {
        let articleId=req.params.articleId;
        let authorId=req.user.userId;
        
        // find article first
        let article=await ArticleModel.findById(articleId);
        
        if(!article){
            return res.status(404).json({message:"Article not found"})
        }
        
        // check if the current user is the author
        if(article.author.toString() !== authorId){
            return res.status(403).json({message:"Unauthorized: Only the article author can delete this article"})
        }
        
        // find and delete article
        let deletedArticle=await ArticleModel.findByIdAndDelete(articleId);
        
        // send res 
        res.status(200).json({message:"Article deleted successfully",payload:deletedArticle})
    } catch (err) {
        res.status(500).json({message:"Error deleting article",reason:err.message})
    }
})

// add comment to article - PROTECTED (any authenticated user can comment)
articleRoute.post('/articles/:articleId/comments', authMiddleware, async(req,res)=>{
    try {
        console.log('\n=== COMMENT ENDPOINT CALLED ===');
        
        const comment = req.body.comment;
        const articleId = req.params.articleId;
        const userId = req.user?.userId;
        
        console.log('Comment data:', { articleId, userId, comment, commentLength: comment?.length });
        
        // Validate inputs
        if(!articleId){
            console.log('ERROR: No article ID');
            return res.status(400).json({message:"Article ID is required"});
        }
        
        if(!userId){
            console.log('ERROR: No user ID in token');
            return res.status(401).json({message:"Authentication failed: User ID not found in token"});
        }
        
        if(!comment || !comment.trim()){
            console.log('ERROR: Empty comment');
            return res.status(400).json({message:"Comment cannot be empty"});
        }
        
        console.log('Searching for article:', articleId);
        // Use atomic $push to add comment without re-validating entire article
        await ArticleModel.findByIdAndUpdate(
            articleId,
            {
                $push: {
                    comments: {
                        comment: comment.trim(),
                        user: userId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                }
            },
            { new: true, runValidators: false }
        );
        
        // Fetch the updated article with populated data
        const populatedArticle = await ArticleModel.findById(articleId)
            .populate('author','name email')
            .populate('comments.user','name email');
        
        if(!populatedArticle){
            console.log('ERROR: Article not found for ID:', articleId);
            return res.status(404).json({message:"Article not found"});
        }
        
        console.log('Comment added! Total comments:', populatedArticle.comments.length);
        console.log('=== COMMENT SUCCESS ===\n');
        res.status(201).json({
            message:"Comment added successfully",
            payload:populatedArticle
        });
    } catch (err) {
        console.error('\n=== COMMENT ERROR ===');
        console.error('Error message:', err.message);
        console.error('Error type:', err.constructor.name);
        console.error('Error stack:', err.stack);
        console.error('Article ID:', req.params.articleId);
        console.error('User ID:', req.user?.userId);
        console.error('===================\n');
        
        res.status(500).json({
            message:"Error adding comment",
            reason: err.message,
            type: err.constructor.name
        });
    }
})

// delete comment from article - PROTECTED
articleRoute.delete('/articles/:articleId/comments/:commentId', authMiddleware, async(req,res)=>{
    try {
        const { articleId, commentId } = req.params;
        const userId = req.user.userId;
        
        // First, fetch article to check authorization
        const article = await ArticleModel.findById(articleId);
        if(!article){
            return res.status(404).json({message:"Article not found"})
        }
        
        const comment = article.comments.id(commentId);
        if(!comment){
            return res.status(404).json({message:"Comment not found"})
        }
        
        // Check if current user is the comment author
        if(comment.user.toString() !== userId){
            return res.status(403).json({message:"Unauthorized: Only comment author can delete this comment"})
        }
        
        // Use atomic $pull to delete comment
        await ArticleModel.findByIdAndUpdate(
            articleId,
            { $pull: { comments: { _id: commentId } } },
            { new: true, runValidators: false }
        );
        
        // Fetch and populate the updated article
        const populatedArticle = await ArticleModel.findById(articleId)
            .populate('author','name email')
            .populate('comments.user','name email');
        
        res.status(200).json({message:"Comment deleted successfully",payload:populatedArticle})
    } catch (err) {
        res.status(500).json({message:"Error deleting comment",reason:err.message})
    }
})

// update comment in article - PROTECTED
articleRoute.put('/articles/:articleId/comments/:commentId', authMiddleware, async(req,res)=>{
    try {
        const { articleId, commentId } = req.params;
        const { comment: updatedComment } = req.body;
        const userId = req.user.userId;
        
        if(!updatedComment){
            return res.status(400).json({message:"Comment text is required"})
        }
        
        // First, fetch article to check authorization
        const article = await ArticleModel.findById(articleId);
        if(!article){
            return res.status(404).json({message:"Article not found"})
        }
        
        const comment = article.comments.id(commentId);
        if(!comment){
            return res.status(404).json({message:"Comment not found"})
        }
        
        // Check if current user is the comment author
        if(comment.user.toString() !== userId){
            return res.status(403).json({message:"Unauthorized: Only comment author can update this comment"})
        }
        
        // Use atomic $set to update comment
        await ArticleModel.findByIdAndUpdate(
            articleId,
            { 
                $set: { 
                    "comments.$[elem].comment": updatedComment.trim(),
                    "comments.$[elem].updatedAt": new Date()
                }
            },
            { 
                arrayFilters: [{ "elem._id": commentId }],
                new: true,
                runValidators: false 
            }
        );
        
        // Fetch and populate the updated article
        const populatedArticle = await ArticleModel.findById(articleId)
            .populate('author','name email')
            .populate('comments.user','name email');
        
        res.status(200).json({message:"Comment updated successfully",payload:populatedArticle})
    } catch (err) {
        res.status(500).json({message:"Error updating comment",reason:err.message})
    }
})

// DEBUG: Get raw article data without population
articleRoute.get('/debug/articles/:articleId', async(req,res)=>{
    try {
        const { articleId } = req.params;
        
        // Get article WITHOUT population
        const rawArticle = await ArticleModel.findById(articleId);
        
        // Get article WITH population
        const populatedArticle = await ArticleModel.findById(articleId)
            .populate('author','name email')
            .populate('comments.user','name email');
        
        res.status(200).json({
            message: "Debug data",
            raw: rawArticle,
            populated: populatedArticle,
            commentsCount: rawArticle?.comments?.length || 0,
            comments: rawArticle?.comments || []
        });
    } catch (err) {
        res.status(500).json({message:"Debug error",reason:err.message})
    }
})
