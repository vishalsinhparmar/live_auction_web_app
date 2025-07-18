import dotenv from 'dotenv';
dotenv.config({
    path:'./.env'
});

import redis from 'redis';
         console.log('redis server',process.env.REDIS_URI)
      export const redisClient =redis.createClient({
            url:process.env.REDIS_URI
         });
export const redisConnection = async()=>{
     try{

         await redisClient.connect();
         console.log("redice database connected successfully");
     }catch(err){
         console.log("error happen in this redisConnection",err)
     }
};

