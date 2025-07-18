import dotenv from 'dotenv';
dotenv.config({
    path:'./.env'
});

import mongoose from "mongoose";
const mongoUrl = process.env.MONGODB_URI;
const dbConnection = async()=>{
     try{
      console.log('mongodb',mongoUrl);
      await mongoose.connect(mongoUrl);
      console.log('db connected successfully')
     }catch(err){
         console.log("error happen in this dbConnection")
     }
};

export default dbConnection;