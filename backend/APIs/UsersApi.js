import express from 'express'
import { register } from '../Controllers/userController.js'
import { authenticate } from '../services/authservices.js'
import { ArticleModel } from '../Models/ArticleModel.js'
import { verifyToken } from '../Middlewares/verifyToken.js'
import { authMiddleware } from '../Middlewares/authMiddleware.js'

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
// read all articles (public route - all articles visible to users)
userRoute.get('/articles',async(req,res)=>{
  try {
    // Show all articles to users regardless of status
    let articles = await ArticleModel.find({}).populate('author','name email').populate('comments.user','name email');
    res.status(200).json({message:"Articles retrieved successfully",payload:articles});
  } catch(err) {
    res.status(500).json({message:"Error retrieving articles",reason:err.message});
  }
})

// add comments to an article (protected route) - DEPRECATED: use /article-api/articles/:articleId/comments instead
// Keeping for backward compatibility but not recommended
userRoute.post('/articles/:articleId/comments', authMiddleware, async (req, res) => {
  try {
    console.log('User API comment request - redirecting to main endpoint');
    const comment = req.body.comment;
    const articleId = req.params.articleId;
    const userId = req.user.userId;
    
    if(!comment || !comment.trim()){
      return res.status(400).json({ message: "Comment cannot be empty" });
    }
    
    // find article
    const article = await ArticleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }
    // push comment
    article.comments.push({ comment, user: userId });
    await article.save();
    
    // Populate author and comment users before sending response
    const populatedArticle = await ArticleModel.findById(articleId).populate('author','name email').populate({ path: 'comments.user', select: 'name email' });
    res.status(201).json({ message: "comments are added", payload: populatedArticle });
  } catch (err) {
    res.status(500).json({ message: "error", reason: err.message });
  }
})
