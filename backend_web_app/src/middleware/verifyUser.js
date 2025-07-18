import jwt from 'jsonwebtoken';
import { sendErrorMessage } from '../utils/sendMessage.js';


export const verifyUser = async(req,res,next)=>{
     try{
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        console.log('token',token)
         if(!token){
           return sendErrorMessage(res,"user have not login yet ! login first",401)
         };
         jwt.verify(token,process.env.JWT_SECRET,(err,data)=>{
            if(err){
                return sendErrorMessage(res,"internal server error",500)
            }else{
                req.user = data
                next();
            }
         })
     }catch(err){
          console.log('error happen verifyUser middleware',err.message)
          return sendErrorMessage(res,"internal server error",500)
     }
};

