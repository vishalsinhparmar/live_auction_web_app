import express from 'express';
import { addAuctionItem, getActiveAuctionItem, getUserAuctionItem, startAuctionItem } from '../controller/addAuctionItem.controller.js';
import upload from '../config/multer.js';
import { verifyUser } from '../middleware/verifyUser.js';
import { rateLimittingAuth } from '../middleware/rateLimiter.js';
const auctionRoutes = express.Router();

auctionRoutes.post('/addAuctionItem',verifyUser,rateLimittingAuth,upload.single('image'),addAuctionItem);
auctionRoutes.patch('/startAuction',verifyUser,startAuctionItem);
auctionRoutes.get('/liveAuction',verifyUser,getActiveAuctionItem);
auctionRoutes.get('/auctionItem',verifyUser,getUserAuctionItem);



export default auctionRoutes;
