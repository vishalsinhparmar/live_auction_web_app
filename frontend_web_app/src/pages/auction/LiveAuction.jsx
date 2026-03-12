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
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-center">
          <p className="text-lg text-gray-700">Please login to view live auctions.</p>
          <NavLink to="/login" className="inline-block mt-3 text-blue-600 font-semibold hover:text-blue-700">
            Login
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2 text-blue-700">Live Auctions</h1>
      <p className="text-center text-gray-500 mb-6">Join live auctions and place your highest bid in real time.</p>

      {loading ? (
        <div className="text-center text-gray-500 text-lg">Loading auctions...</div>
      ) : auctionItem && auctionItem.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionItem.map((item) => (
            <AuctionCard key={item._id} item={item} currentUser={user} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-20">🕑 No live auction items found at the moment.</div>
      )}
    </div>
  );
};

export default LiveAuction;
