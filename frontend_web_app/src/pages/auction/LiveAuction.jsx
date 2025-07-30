// pages/LiveAuction.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { liveAuctionData } from "../../features/auction/auctionSlice";
import AuctionCard from "../../components/AuctionCard";
import { NavLink } from "react-router-dom";

const LiveAuction = () => {
  const dispatch = useDispatch();
  const { loading, auctionItem } = useSelector((state) => state.auction);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(liveAuctionData());
  }, [dispatch]);

  if (!user) {
    return (
      <div className="text-center mt-10 text-lg text-gray-700">
        Please login to view live auctions.
        <NavLink to="/login" className="text-blue-600 ml-2 underline">
          Login
        </NavLink>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Live Auctions</h1>
      {loading ? (
        <div className="text-center text-gray-500 text-lg">Loading auctions...</div>
      ) : auctionItem && auctionItem.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctionItem.map((item) => (
             <AuctionCard key={item._id} item={item} currentUser={user} />
              ))}

        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-20">
          🕑 No live auction items found at the moment.
        </div>
      )}
    </div>
  );
};

export default LiveAuction;
