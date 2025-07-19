import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAuctionItemAsync } from "../../features/auction/userSlice";
import {
  startAuctionDataAsync,
  liveAuctionData,
  resetAuthState,
} from "../../features/auction/auctionSlice";
import { toast } from "react-toastify";

const UserItem = () => {
  const dispatch = useDispatch();

  const { loading, error, auctionItemData } = useSelector(
    (state) => state.userItem
  );

  const auctionState = useSelector((state) => state.auction);
  const { message, error: auctionError } = auctionState;

  const [selectedAuctionId, setSelectedAuctionId] = useState(null);

  useEffect(() => {
    dispatch(userAuctionItemAsync());
  }, [dispatch]);

  useEffect(() => {
    if (message?.startAuctionDataAsync && selectedAuctionId) {
      toast.success(message.startAuctionDataAsync);

      dispatch(userAuctionItemAsync()); // Refresh user's items
      dispatch(liveAuctionData());      // Update live auction list

      setSelectedAuctionId(null);

      dispatch(resetAuthState());
    }

    if (auctionError?.startAuctionDataAsync && selectedAuctionId) {
      toast.error(auctionError.startAuctionDataAsync || "Failed to start auction.");
      setSelectedAuctionId(null);

      
      dispatch(resetAuthState());
    }
  }, [message, auctionError, selectedAuctionId, dispatch]);

  const handleClick = (id) => {
    setSelectedAuctionId(id);
    const form = { auctionItemId: id }
    dispatch(startAuctionDataAsync(form));
  };

  if (loading) {
    return <p className="text-center text-blue-500">Loading your auctions...</p>;
  }

  if (error?.userAuctionItemAsync) {
    return <p className="text-center text-red-500">{error.userAuctionItemAsync}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Your Auction Items</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {auctionItemData?.map((item) => (
          <div key={item._id} className="border rounded-lg shadow-md p-4 space-y-4 bg-white">
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p className="text-gray-600">{item.description}</p>
            <img
              src={item.filepath}
              alt={item.title}
              className="w-full h-64 object-cover rounded"
            />
            <div className="flex justify-between items-center text-sm">
              <span className="bg-black text-white px-3 py-1 rounded-full">
                ₹{item.startingPrice}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-white ${
                  item.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {item.isActive ? "LIVE" : "OFFLINE"}
              </span>
            </div>
            {!item.isActive && (
              <button
                onClick={() => handleClick(item._id)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Start Auction
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserItem;
