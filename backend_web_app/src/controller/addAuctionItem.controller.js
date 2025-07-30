import { redisClient } from "../../redisClient.js";
import AuctionItem from "../model/autionItem.model.js";
import Bid from "../model/bid.model.js";
import { sendErrorMessage, sendSuccessMessage } from "../utils/sendMessage.js";
import moment from "moment";

const addAuctionItem = async (req, res) => {
  const { title, description, startingPrice, startTime, endTime } = req.body;
  const filepath = req.file.path;
  
  console.log('filepath',filepath);
  try {
    if (!title || !description || !startingPrice || !startTime || !endTime) {
      return sendErrorMessage(res, "Missing required fields", 400);
    }

    const start = moment(startTime).toDate();
    const end = moment(endTime).toDate();

    // Validate parsed dates
    if (isNaN(start) || isNaN(end)) {
      return sendErrorMessage(res, "Invalid date format", 400);
    }

    const newItem = await AuctionItem.create({
      title,
      description,
      filepath,
      startingPrice,
      currentPrice:startingPrice,
      startTime:start,
      endTime:end,
      createdBy: req.user.sub,
      originalOwner: req.user.sub,
      ownerId: req.user.sub
    });

    console.log('newItem',newItem);

    await redisClient.set(`auctionData:${newItem._id}:Data`, JSON.stringify(newItem));


    sendSuccessMessage(res, "Auction item created", newItem, 201);
  } catch (err) {
    console.error("Error in addAuctionItem:", err);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};

// autoCloseAution 

const autoCloseAuction = async(auctionId)=>{
   try{
      console.log('auctionId',auctionId);
      const auction = await AuctionItem.findById(auctionId);
      console.log('auction',auction);
      if(!auction || !auction.isActive) return;

      const highestBid = await Bid.findOne({auctionId }).sort({amount:-1});
      console.log('higehstBId',highestBid)
      auction.isActive = false;

    if (highestBid) {
      auction.winnerId = highestBid.userId;
      auction.ownerId = highestBid.userId;  // Transfer ownership
    } else {
      auction.ownerId = auction.originalOwner;  // No bids: return to original owner
    }
      await auction.save();
   }catch(err){
     console.log('error happen in this autoCloseAution',err.message)
   }
}
const startAuctionItem = async (req, res) => {
  const { auctionItemId } = req.body;

  try {
    const auction = await AuctionItem.findById(auctionItemId);
    if (!auction) return sendErrorMessage(res, "Auction item not found", 404);
    if (auction.isActive) return sendErrorMessage(res, "Auction already started", 400);

    const now = new Date();

    const originalStart = new Date(auction.startTime);  // Store original startTime
    const originalDurationMs = new Date(auction.endTime).getTime() - originalStart.getTime();

    auction.isActive = true;
    auction.startTime = now;
    auction.endTime = new Date(now.getTime() + originalDurationMs);

    await auction.save();

    await redisClient.set(`auction:${auction._id}:highestBid`, auction.currentPrice);

    // Schedule auto-close
    setTimeout(() => autoCloseAuction(auction._id), originalDurationMs);

    sendSuccessMessage(res, "Auction started successfully", auction, 200);
  } catch (err) {
    console.error("Error in startAuctionItem:", err);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};

const getUserAuctionItem = async (req, res) => {
  const userId = req?.user?.sub;

  try {
   const items = await AuctionItem.find({
      originalOwner: userId,
      $or: [
        { winnerId: null },
        { winnerId: userId }
      ]
    }).populate('createdBy winnerId').sort({ createdAt: -1 });

    return sendSuccessMessage(res, "Your created auction items", items, 200);
  } catch (err) {
    console.error("Error in getUserAuctionItem:", err);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};


const getWonAuctions = async (req, res) => {
  const userId = req.user.sub;

  try {
    const wonAuctions = await AuctionItem.find({
      winnerId: userId,
      originalOwner: { $ne: userId } // ✅ Optional: exclude self-won auctions
    })
      .populate('createdBy winnerId originalOwner')
      .sort({ endTime: -1 });

    if (!wonAuctions.length) {
      return sendErrorMessage(res, "You haven't won any auctions yet", 404);
    }

    return sendSuccessMessage(res, "Fetched auctions you won", wonAuctions, 200);
  } catch (err) {
    console.error("Error in getWonAuctions:", err);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};



const getActiveAuctionItem = async (req, res) => {
  try {
    const activeAuctions = await AuctionItem.find({ isActive: true })
      .sort({ startTime: -1 })
      .populate('createdBy')
      .populate('winnerId'); // 🔄 Add winner info

    if (!activeAuctions.length) return sendErrorMessage(res, "No active auctions found", 404);

    return sendSuccessMessage(res, "Fetched active auctions", activeAuctions, 200);
  } catch (err) {
    console.error("Error in getActiveAuctionItem:", err);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};





export {
    addAuctionItem,
    getActiveAuctionItem,
    startAuctionItem,
    getUserAuctionItem,
    getWonAuctions
}
