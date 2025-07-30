// models/auctionItem.model.js
import mongoose from "mongoose";

const auctionItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  startingPrice: {
    type: Number,
    required: true
  },
  currentPrice: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  originalOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ownerId: {  // New field to track current ownership
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

const AuctionItem = mongoose.model("AuctionItem", auctionItemSchema);
export default AuctionItem;
