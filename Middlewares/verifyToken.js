import jwt from 'jsonwebtoken';
import {config} from 'dotenv';
config();
export const verifyToken = (req, res, next) => {
    //read token from req
    let token=req.cookies.token;
    console.log("token",token);  
    // verify the validity of token
    if(!token){
        return res.status(401).json({message:"Unauthorized req .Plz login"})
    }
    // verify the validity of the token(decoding the token)
let decodedToken=jwt.verify(token,process.env.JWT_SECRET_KEY);
    // forward the req to next middleware
next();
}
