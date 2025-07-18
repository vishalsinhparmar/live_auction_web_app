import { redisClient } from "../../redisClient.js";
import AuctionItem from "../model/autionItem.model.js";
import { sendErrorMessage, sendSuccessMessage } from "../utils/sendMessage.js";

const addAuctionItem = async (req, res) => {
  const { title, description, startingPrice, startTime, endTime } = req.body;
  const filepath = req.file.path;
  
  console.log('filepath',filepath);
  try {
    if (!title || !description || !startingPrice || !startTime || !endTime) {
      return sendErrorMessage(res, "Missing required fields", 400);
    }

    const newItem = await AuctionItem.create({
      title,
      description,
      filepath,
      startingPrice,
      currentPrice: startingPrice,
      startTime:new Date(startTime),
      endTime:new Date(endTime),
      createdBy: req.user.sub 
    });

    sendSuccessMessage(res, "Auction item created", newItem, 201);
  } catch (err) {
    console.error("Error in addAuctionItem:", err);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};


const startAuctionItem = async (req, res) => {
  const { auctionItemId } = req.body;

  try {
    const auction = await AuctionItem.findById(auctionItemId);
    if (!auction) return sendErrorMessage(res, "Auction item not found", 404);

    if (auction.isActive) {
      return sendErrorMessage(res, "Auction already started", 400);
    }

    auction.isActive = true;
    auction.startTime = new Date();
    await auction.save();

    await redisClient.set(`auction:${auction._id}:highestBid`, auction.currentPrice);

    sendSuccessMessage(res, "Auction started successfully", auction, 200);
  } catch (err) {
    console.error("Error in startAuctionItem:", err);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};

const getUserAuctionItem = async (req, res) => {
  try {
    const userAuctionItem = await AuctionItem.find().sort({createdAt:-1});
    if (!userAuctionItem.length) return sendErrorMessage(res, "No active auctions found", 404);

    return sendSuccessMessage(res, "Fetched auctions item", userAuctionItem, 200);
  } catch (err) {
    console.error("Error in userAuctionItem:", err);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};

const getActiveAuctionItem = async (req, res) => {
  try {
    const activeAuctions = await AuctionItem.find({ isActive: true }).sort({ startTime: -1 }).populate('createdBy');
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
    getUserAuctionItem
}
