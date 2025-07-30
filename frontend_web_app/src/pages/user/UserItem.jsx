import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  userAuctionItemAsync,
} from "../../features/auction/userSlice";
import {
  startAuctionDataAsync,
  liveAuctionData,
  resetAuthState,
} from "../../features/auction/auctionSlice";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

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
      dispatch(userAuctionItemAsync());
      dispatch(liveAuctionData());
      setSelectedAuctionId(null);
      dispatch(resetAuthState());
    }

    if (auctionError?.startAuctionDataAsync && selectedAuctionId) {
      toast.error(auctionError.startAuctionDataAsync || "Failed to start auction.");
      setSelectedAuctionId(null);
      dispatch(resetAuthState());
    }
  }, [message, auctionError, selectedAuctionId, dispatch]);

  const handleStartAuction = (id) => {
    setSelectedAuctionId(id);
    dispatch(startAuctionDataAsync({ auctionItemId: id }));
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-lg text-blue-600">
        Loading your auction items...
      </div>
    );
  }

  if (error?.userAuctionItemAsync) {
    return <p className="text-center text-red-500">{error.userAuctionItemAsync}</p>;
  }

  if (auctionItemData.length === 0) {
    return (
      <div className="text-center py-12 text-xl text-gray-700">
        No auction items found.
        <NavLink to="/addAuction" className="text-blue-500 ml-2 underline">
          Add Auction
        </NavLink>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading overlay */}
      {selectedAuctionId && (
        <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-500 h-20 w-20 animate-spin"></div>
            <p className="text-gray-800 font-medium text-lg">Starting auction...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`max-w-6xl mx-auto px-4 py-6 transition duration-300 ${
          selectedAuctionId ? "blur-sm" : ""
        }`}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Your Auction Items</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionItemData?.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col space-y-4 hover:shadow-lg transition"
            >
              <img
                src={item.filepath || "https://via.placeholder.com/400x300?text=No+Image"}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md"
              />

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-800">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>

              <div className="flex justify-between items-center text-sm mt-1">
                <span className="bg-black text-white px-3 py-1 rounded-full">
                  ₹{item.startingPrice}
                </span>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    item.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {item.isActive ? "LIVE" : "CLOSED"}
                </span>
              </div>

              {/* Winner or not? */}
              {!item.isActive && item.winnerId && item.winnerId._id !== item.originalOwner && (
                <p className="text-sm text-red-600 mt-1 font-semibold">
                  ❌ Lost to: {item.winnerId?.username || "Another user"}
                </p>
              )}

              {/* Show start button only if it's yours and it's offline */}
              {!item.isActive && !item.winnerId && (
                <button
                  onClick={() => handleStartAuction(item._id)}
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mt-2"
                >
                  Start Auction
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserItem;
