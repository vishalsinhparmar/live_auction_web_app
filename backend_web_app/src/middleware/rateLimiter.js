import { redisClient, redisConnection } from "../../redisClient.js";
import { sendErrorMessage } from "../utils/sendMessage.js";

export const rateLimittingAuth = async(req,res,next)=>{
    const ip = req.ip;
     try{
        const key = `login:attempts:${ip}`;
        console.log('key',key);
        const count = await redisClient.incr(key);
        console.log('count',count);
        if(count === 1){
            await redisClient.expire(key,60)
        }
        if(count>5){
            return sendErrorMessage(res,"user have try to multiple time login",429)
        };
        next()
     }catch(err){
         sendErrorMessage(res,'internal server error',501)
         console.log('error happen in this rateLimittingAuth',err)
     }
}