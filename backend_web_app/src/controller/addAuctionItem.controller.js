import moment from "moment";
import { redisSet } from "../../redisClient.js";
import AuctionItem from "../model/autionItem.model.js";
import Bid from "../model/bid.model.js";
import { sendErrorMessage, sendSuccessMessage } from "../utils/sendMessage.js";

const addAuctionItem = async (req, res) => {
  const { title, description, startingPrice, startTime, endTime } = req.body;
  const filepath = req.file?.path;

  try {
    if (!title || !description || !startingPrice || !startTime || !endTime) {
      return sendErrorMessage(res, "Missing required fields", 400);
    }

    if (!filepath) {
      return sendErrorMessage(res, "Auction image is required", 400);
    }

    const start = moment(startTime).toDate();
    const end = moment(endTime).toDate();

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return sendErrorMessage(res, "Invalid date format", 400);
    }

    const newItem = await AuctionItem.create({
      title,
      description,
      filepath,
      startingPrice,
      currentPrice: startingPrice,
      startTime: start,
      endTime: end,
      createdBy: req.user.sub,
      originalOwner: req.user.sub,
      ownerId: req.user.sub,
    });

    await redisSet(`auctionData:${newItem._id}:Data`, JSON.stringify(newItem));

    sendSuccessMessage(res, "Auction item created", newItem, 201);
  } catch (err) {
    console.error("Error in addAuctionItem:", err.message);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};

const updateAuctionItem = async (req, res) => {
  const { auctionItemId } = req.params;
  const { title, description, startingPrice, startTime, endTime } = req.body;
  const userId = req.user.sub;

  try {
    const auction = await AuctionItem.findById(auctionItemId);

    if (!auction) {
      return sendErrorMessage(res, "Auction item not found", 404);
    }

    if (String(auction.originalOwner) !== String(userId)) {
      return sendErrorMessage(res, "You are not allowed to edit this auction", 403);
    }

    if (auction.isActive || auction.winnerId) {
      return sendErrorMessage(res, "Only inactive auctions without winners can be edited", 400);
    }

    const nextStart = startTime ? moment(startTime).toDate() : auction.startTime;
    const nextEnd = endTime ? moment(endTime).toDate() : auction.endTime;

    if (Number.isNaN(nextStart.getTime()) || Number.isNaN(nextEnd.getTime())) {
      return sendErrorMessage(res, "Invalid date format", 400);
    }

    auction.title = title ?? auction.title;
    auction.description = description ?? auction.description;
    auction.startTime = nextStart;
    auction.endTime = nextEnd;

    if (startingPrice !== undefined && startingPrice !== null && startingPrice !== "") {
      const numericStartingPrice = Number(startingPrice);

      if (Number.isNaN(numericStartingPrice) || numericStartingPrice <= 0) {
        return sendErrorMessage(res, "Starting price must be a positive number", 400);
      }

      auction.startingPrice = numericStartingPrice;
      auction.currentPrice = numericStartingPrice;
    }

    if (req.file?.path) {
      auction.filepath = req.file.path;
    }

    await auction.save();
    await redisSet(`auctionData:${auction._id}:Data`, JSON.stringify(auction));
    await redisSet(`auction:${auction._id}:highestBid`, String(auction.currentPrice));

    return sendSuccessMessage(res, "Auction item updated successfully", auction, 200);
  } catch (err) {
    console.error("Error in updateAuctionItem:", err.message);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};

const deleteAuctionItem = async (req, res) => {
  const { auctionItemId } = req.params;
  const userId = req.user.sub;

  try {
    const auction = await AuctionItem.findById(auctionItemId);

    if (!auction) {
      return sendErrorMessage(res, "Auction item not found", 404);
    }

    if (String(auction.originalOwner) !== String(userId)) {
      return sendErrorMessage(res, "You are not allowed to delete this auction", 403);
    }

    if (auction.isActive || auction.winnerId) {
      return sendErrorMessage(res, "Only inactive auctions without winners can be deleted", 400);
    }

    await Bid.deleteMany({ auctionId: auction._id });
    await auction.deleteOne();

    return sendSuccessMessage(res, "Auction item deleted successfully", null, 200);
  } catch (err) {
    console.error("Error in deleteAuctionItem:", err.message);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};

const autoCloseAuction = async (auctionId) => {
  try {
    const auction = await AuctionItem.findById(auctionId);

    if (!auction || !auction.isActive) return;

    const highestBid = await Bid.findOne({ auctionId }).sort({ amount: -1 });
    auction.isActive = false;

    if (highestBid) {
      auction.winnerId = highestBid.userId;
      auction.ownerId = highestBid.userId;
    } else {
      auction.ownerId = auction.originalOwner;
    }

    await auction.save();
  } catch (err) {
    console.log("error happen in this autoCloseAution", err.message);
  }
};

const startAuctionItem = async (req, res) => {
  const { auctionItemId } = req.body;

  try {
    const auction = await AuctionItem.findById(auctionItemId);

    if (!auction) return sendErrorMessage(res, "Auction item not found", 404);
    if (auction.isActive) return sendErrorMessage(res, "Auction already started", 400);

    const now = new Date();
    const originalStart = new Date(auction.startTime);
    const originalDurationMs = new Date(auction.endTime).getTime() - originalStart.getTime();

    auction.isActive = true;
    auction.startTime = now;
    auction.endTime = new Date(now.getTime() + originalDurationMs);

    await auction.save();
    await redisSet(`auction:${auction._id}:highestBid`, String(auction.currentPrice));

    setTimeout(() => autoCloseAuction(auction._id), originalDurationMs);

    sendSuccessMessage(res, "Auction started successfully", auction, 200);
  } catch (err) {
    console.error("Error in startAuctionItem:", err.message);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};

const getUserAuctionItem = async (req, res) => {
  const userId = req?.user?.sub;

  try {
    const items = await AuctionItem.find({
      originalOwner: userId,
      $or: [{ winnerId: null }, { winnerId: userId }],
    })
      .populate("createdBy winnerId")
      .sort({ createdAt: -1 });

    return sendSuccessMessage(res, "Your created auction items", items, 200);
  } catch (err) {
    console.error("Error in getUserAuctionItem:", err.message);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};

const getWonAuctions = async (req, res) => {
  const userId = req.user.sub;

  try {
    const wonAuctions = await AuctionItem.find({
      winnerId: userId,
      originalOwner: { $ne: userId },
    })
      .populate("createdBy winnerId originalOwner")
      .sort({ endTime: -1 });

    if (!wonAuctions.length) {
      return sendErrorMessage(res, "You haven't won any auctions yet", 404);
    }

    return sendSuccessMessage(res, "Fetched auctions you won", wonAuctions, 200);
  } catch (err) {
    console.error("Error in getWonAuctions:", err.message);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};

const getActiveAuctionItem = async (req, res) => {
  try {
    const activeAuctions = await AuctionItem.find({ isActive: true })
      .sort({ startTime: -1 })
      .populate("createdBy")
      .populate("winnerId");

    if (!activeAuctions.length) {
      return sendErrorMessage(res, "No active auctions found", 404);
    }

    return sendSuccessMessage(res, "Fetched active auctions", activeAuctions, 200);
  } catch (err) {
    console.error("Error in getActiveAuctionItem:", err.message);
    return sendErrorMessage(res, "Internal Server Error", 500);
  }
};

export {
  addAuctionItem,
  updateAuctionItem,
  deleteAuctionItem,
  getActiveAuctionItem,
  startAuctionItem,
  getUserAuctionItem,
  getWonAuctions,
};
