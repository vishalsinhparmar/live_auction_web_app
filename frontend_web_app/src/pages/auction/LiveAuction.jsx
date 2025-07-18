// pages/LiveAuction.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { liveAuctionData } from "../../features/auction/auctionSlice";
import AuctionCard from "../../components/AuctionCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LiveAuction = () => {
  const dispatch = useDispatch();
  const { loading, auctionItem } = useSelector((state) => state.auction);
  const { message,user } = useSelector((state) => state.auth); 
  const navigate = useNavigate();
  useEffect(() => {
     if (message.login && user) {
      toast.error("You must be logged in to access live auctions");
      navigate("/login");
      return;
    }
      dispatch(liveAuctionData());
     
    }, [dispatch, user, navigate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {loading ? (
        <p>Loading...</p>
      ) : (
        auctionItem?.map((item) => <AuctionCard key={item._id} item={item} />)
      )}
    </div>
  );
};

export default LiveAuction;
