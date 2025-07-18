// models/bid.model.js
import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: "AuctionItem", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  time: { type: Date, default: Date.now }
});

const Bid = mongoose.model("Bid", bidSchema);
export default Bid;
