import {Schema,model} from 'mongoose'

//create cart schema
const cartSchema = new Schema({
  product:{
    type:Schema.Types.ObjectId,
    ref:"product" //name of product model
  }
})
//user schema
const userSchema = new Schema({
  name:{
    type:String,
    required:[true,"Name is required"]
  },
  email:{
    type:String,
    required:[true,"Email is required"],
    unique:true
  },
  password: {
    type: String,
    required:[true,"Password is required"]
  },
  cart:{
    type:[cartSchema]
  }

},{
  strict:"throw",
  timestamps:true,
  versionKey:false
})

export const UserModel = model("user",userSchema);