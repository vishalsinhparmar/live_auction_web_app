
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { sendErrorMessage, sendSuccessMessage } from "../utils/sendMessage.js";
import User from "../model/user.model.js";

const UserSignUp = async(req,res)=>{
    const {username,email,password} = req.body; 
    // console.log('req.body',req.body)
  
     try{
        if(!username && !email && !password){
            return sendErrorMessage(res,"bad request ! user have not provide a valid credentials",400)
       }
       const user = await User.findOne({
        email
       });
       console.log('user',user)
       if(user?.email === email){
           return sendErrorMessage(res,"user have already exists",409)
       };
       const hashPassword = await bcrypt.hash(password,10);
       if(!hashPassword){
         return sendErrorMessage(res,'internal server error',500)
       }
      const newUser = await User.create({
         username,
         email,
         password:hashPassword
       });
       if(!newUser){
         return sendErrorMessage(res,"internal server error",500)
       }
       sendSuccessMessage(res,'user have register successfully',201)
      console.log('newUser',newUser)
     }catch(err){
         console.log('internal server error',err.message)
         return sendErrorMessage(res,"internal server error",500)
     }
};

const UserSignIn = async(req,res)=>{
    const {email,password} = req.body; 
    console.log('req.body',req.body)
  
     try{
        if(!email && !password){
            return sendErrorMessage(res,"bad request ! user have not provide a valid credentials",400)
       }
       const user = await User.findOne({
        email
       });
       console.log('user',user)

       if(!user){
           return sendErrorMessage(res,"user have not register yet",409)
       };
       const hashPassword = await bcrypt.compare(password,user.password);
       if(!hashPassword){
         return sendErrorMessage(res,'user have not provide a valid password',401)
       }
       const token = await jwt.sign({sub:user._id},process?.env?.JWT_SECRET,{expiresIn:"7d"});
       if(!token){
           return sendErrorMessage(res,"internal server error",500)
       }
       sendSuccessMessage(res,'user have login successfully',token,201)

     }catch(err){
         console.log('internal server error',err.message)
         return sendErrorMessage(res,"internal server error",500)
     }
};




const loginUser = async(req,res)=>{
  // console.log('req.body',req.body)
  const userId = req.user.sub;
   try{
     if(!userId){
       return sendErrorMessage(res,"user have not login",401)
     }
     const user = await User.findById(userId);

     if(!user){
         return sendErrorMessage(res,"user have not found",404)
     };

     sendSuccessMessage(res,'user have login successfully',user,201)

   }catch(err){
       console.log('internal server error',err.message)
       return sendErrorMessage(res,"internal server error",500)
   }
};

export {
     UserSignUp,
     UserSignIn,
     loginUser
}