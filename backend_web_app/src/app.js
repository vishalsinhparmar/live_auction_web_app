import dotenv from 'dotenv';
dotenv.config({
    path:'../.env'
});

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import dbConnection from '../db.js';
import { redisConnection } from '../redisClient.js';
import auctionRoutes from './routes/auctionRoutes.js';
import bidRoutes from './routes/bidRoutes.js';

const app = express();
app.use(cors());
dbConnection();
redisConnection();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/',(req,res)=>{
    res.send('server is running')
});

app.use('/api/auth',userRoutes);
app.use('/api/auction',auctionRoutes);
app.use('/api/bid',bidRoutes);


export default app;