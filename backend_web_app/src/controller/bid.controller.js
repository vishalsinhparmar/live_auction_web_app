import Bid from "../model/bid.model.js";
import { sendErrorMessage, sendSuccessMessage } from "../utils/sendMessage.js";

export const fetchAuctionBid = async(req,res)=>{
    const {auctionId} = req.params;
    try{
         const bids = await Bid.find({auctionId}).populate("userId", "username")
      .sort({ time: -1 })
      .limit(50);

      if(!bids){
          return sendErrorMessage(res,"bids have not found something went wrong",404)
      };
      const bidData = bids.map((bid)=>(
        {
            amount:bid.amount,
            username:bid.userId.username,
            time:bid.time
        }
      ));

      console.log('bidData',bidData)
      sendSuccessMessage(res,"bid fetch successfully",bidData,200)
    }catch(err){
         console.log('error happen ins fetchAuctionBid',err)
    }
}