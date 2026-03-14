import express from "express";
import {
  addAuctionItem,
  deleteAuctionItem,
  getActiveAuctionItem,
  getUserAuctionItem,
  getWonAuctions,
  startAuctionItem,
  updateAuctionItem,
} from "../controller/addAuctionItem.controller.js";
import upload from "../config/multer.js";
import { verifyUser } from "../middleware/verifyUser.js";
import { rateLimittingAuth } from "../middleware/rateLimiter.js";

const auctionRoutes = express.Router();

auctionRoutes.post("/addAuctionItem", verifyUser, rateLimittingAuth, upload.single("image"), addAuctionItem);
auctionRoutes.patch("/startAuction", verifyUser, rateLimittingAuth, startAuctionItem);
auctionRoutes.put("/auctionItem/:auctionItemId", verifyUser, upload.single("image"), updateAuctionItem);
auctionRoutes.delete("/auctionItem/:auctionItemId", verifyUser, deleteAuctionItem);
auctionRoutes.get("/liveAuction", verifyUser, getActiveAuctionItem);
auctionRoutes.get("/auctionItem", verifyUser, getUserAuctionItem);
auctionRoutes.get("/won-auctions", verifyUser, getWonAuctions);

export default auctionRoutes;
