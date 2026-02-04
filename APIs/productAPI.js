import exp from 'express'
import { ProductModel } from '../Models/ProductModel.js'

export const productRoute = exp.Router()



productRoute.get('/products', async( req,res)=>{
  const products = await ProductModel.find();
  //send res to client
  res.status(200).json({"message":"All  Products", "payload": products});
})
//route to create new product
productRoute.post('/products', async (req, res, next) => {
  
  const productObj = req.body
  // create and save product
  const product = new ProductModel(productObj)
  const saved = await product.save()
  return res.status(201).json({ message: 'Product created', product: saved })
  
})

