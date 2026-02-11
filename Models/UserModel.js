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
    unique:[true,"Email already exists"]
  },
  password: {
    type: String,
    required:[true,"Password is required"]
  },
  profileImage:{
    type:String,
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  },
  role:{
    type:String,
    enum:["user","admin","author"],
    default:"user"
  },status:{
    type:String,
    enum:["active","blocked"],
    default:"active"
  }
},{
  strict:"throw",
  timestamps:true,
  versionKey:false
})


export const UserModel = model("user",userSchema);