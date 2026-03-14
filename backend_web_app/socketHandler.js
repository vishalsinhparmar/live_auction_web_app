import mongoose from "mongoose";
import { redisGet, redisSet } from "./redisClient.js";
import AuctionItem from "./src/model/autionItem.model.js";
import Bid from "./src/model/bid.model.js";

export const setUpsocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("client connected", socket.id);

    socket.on("join-auction", (auctionId) => {
      socket.join(auctionId);
      console.log("joined auction room", auctionId);
    });

    socket.on("place-bid", async ({ auctionId, userId, amount }) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const opts = { session };
        const auction = await AuctionItem.findById(auctionId).session(session);

        if (!auction || !auction.isActive) {
          socket.emit("bid-rejected", {
            message: "Auction is not available for bidding",
          });
          await session.abortTransaction();
          session.endSession();
          return;
        }

        const cachedBid = await redisGet(`auction:${auctionId}:highestBid`);
        const currentBid = Number.parseFloat(cachedBid) || auction.currentPrice;

        if (amount <= currentBid) {
          socket.emit("bid-lessthen", {
            message: `Bid must be higher than Rs ${currentBid}`,
            currentBid,
            yourBid: amount,
          });
          await session.abortTransaction();
          session.endSession();
          return;
        }

        await Bid.create(
          [
            {
              userId,
              auctionId,
              amount,
              time: new Date(),
            },
          ],
          opts
        );

        auction.currentPrice = amount;
        await auction.save(opts);
        await redisSet(`auction:${auctionId}:highestBid`, amount.toString());

        await session.commitTransaction();
        session.endSession();

        io.to(auctionId).emit("new-bid", {
          userId,
          auctionId,
          amount,
          time: new Date(),
        });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();

        socket.emit("bid-rejected", {
          message: err.message || "bid failed",
        });

        console.log("Something went wrong in place-bid:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnected", socket.id);
    });
  });
};
