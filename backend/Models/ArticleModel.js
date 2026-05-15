import {Schema,model} from 'mongoose'
//create article schema
const articleSchema = new Schema({
  title:{
    type:String,
    required:[true,"Title is required"]
  },
  content:{
    type:String,
    required:[true,"Content is required"]
  },
  author:{
    type:Schema.Types.ObjectId,
    ref:"user"
  },
  category:{
    type:String,
    required:[true,"Category is required"],
    enum:["technology","health","lifestyle","education","entertainment"]
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  updatedAt:{
    type:Date,
    default:Date.now()
  },
  // now create comments as array of objects
  comments:[
    {
      user:{
        type:Schema.Types.ObjectId,
        ref:"user"
      },
      comment:{
        type:String,
        required:[true,"Comment is required"]
      },
      createdAt:{
        type:Date,
        default:Date.now()
      },
      updatedAt:{
        type:Date,
        default:Date.now()
      }
    }
  ],
  status:{
    type:String,
    enum:["active","inactive"],
    default:"inactive"
  }
},

{
  timestamps:true,
  versionKey:false
})
export const ArticleModel = model("article",articleSchema);