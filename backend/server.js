import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import { connect } from 'mongoose'
import { userRoute } from './APIs/UsersApi.js'
import { authorRoute } from './APIs/AuthorApi.js'
import { adminRoute } from './APIs/AdminApi.js'
import { articleRoute } from './APIs/ArticlesApi.js'
import { authMiddleware } from './Middlewares/authMiddleware.js'
import { commonRouter } from './APIs/CommonApi.js'
import cors from 'cors'
dotenv.config()

// create http server
const app = express()
const port = process.env.PORT || 4000
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecomdb'
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
const allowedOrigins = frontendUrl.split(',').map(url => url.trim()).concat(['http://localhost:5173', 'http://localhost:5174'])

// Connect to MongoDB database
async function connectDB() {
  try {
    await connect(mongodbUri)
    console.log('Connected to DB')
    app.listen(port, () => console.log(`server listening to port ${port}...`))
  } catch (err) {
    console.error('DB connection error:', err.message)
    process.exit(1)
  }
}

connectDB()
app.use(cors({ origin: allowedOrigins, credentials: true }))
// use body parser middleware
app.use(express.json())
app.use(cookieParser())

// forward req to specific APIs
app.use('/user-api', userRoute)
app.use('/author-api', authorRoute);
app.use('/admin-api', adminRoute);
app.use('/article-api', articleRoute);
app.use('/common-api', commonRouter);

//app.use('/product-api', productRoute)

// logout for user,author and admin(clear cookie)

//app.post('/logout', (req, res) => {
 // res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: true })// must match original cookie options
 // res.status(200).json({ message: 'Logout successful' })
//})


// dealing with invalid path 
app.use((req, res,next) => {
  //console.log(req)//however req is a very big object so we are logging it to see what it contains
console.log(req.url);// it will give us the path of the req which is being made to the server
  res.json({ message: `${req.url} is invalid`  }); // it has to be placed here becouse if we place it before the API routes 
})                   //then it will be executed for all the requests and we will get invalid path for all the requests

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'error', reason: err.message })
})

let a=10,b=20,c=30;
console.log("a is",a,"b is",b,"c is",c);
// template literals