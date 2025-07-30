import express from 'express';
import { verifyUser } from '../middleware/verifyUser.js';
import { fetchAuctionBid } from '../controller/bid.controller.js';
const bidRoutes = express.Router();

bidRoutes.get('/bidItem/:auctionId',fetchAuctionBid);

export default bidRoutes;
