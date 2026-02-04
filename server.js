import express from 'express'
import { connect } from 'mongoose'
import { userRoute } from './APIs/userAPI.js'
import { productRoute } from './APIs/productAPI.js'

// create http server
const app = express()
const port = 4000

// Connect to MongoDB database
async function connectDB() {
  try {
    await connect('mongodb://localhost:27017/ecomdb')
    console.log('Connected to DB')
    app.listen(port, () => console.log(`server listening to port ${port}...`))
  } catch (err) {
    console.error('DB connection error:', err.message)
    process.exit(1)
  }
}

connectDB()

// use body parser middleware
app.use(express.json())

// forward req to specific APIs
app.use('/user-api', userRoute)
app.use('/product-api', productRoute)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'error', reason: err.message })
})