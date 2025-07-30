import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { socket } from "../utils/socket";

const AuctionCard = ({ item, currentUser }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    socket.emit("join-auction", item._id);
    fetchBidHistory();

    socket.on("new-bid", (data) => {
      if (data.auctionId === item._id) {
        setBids((prev) => [data, ...prev]);
        toast.success(`New bid on ${item.title}: ₹${data.amount}`);
      }
    });

    socket.on("bid-lessthen", (msg) => toast.warning(msg.message));
    socket.on("bid-rejected", (msg) => toast.error(msg.message));

    return () => {
      socket.off("new-bid");
      socket.off("bid-lessthen");
      socket.off("bid-rejected");
    };
  }, [item._id]);

  useEffect(() => {
    if (!item.isActive || !item.endTime) return;

    const updateTimeLeft = () => {
      const end = new Date(item.endTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Auction Ended");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [item.endTime, item.isActive]);

  const fetchBidHistory = async () => {
    try {
      const { data } = await axios.get(`http://localhost:4000/api/bid/bidItem/${item._id}`);
      setBids(data?.data || []);
    } catch {
      toast.error("Failed to fetch bid history");
    }
  };

  const handleBid = () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) return toast.warning("Enter a valid bid");

    socket.emit("place-bid", {
      auctionId: item._id,
      userId: currentUser._id,
      amount,
    });

    setBidAmount("");
  };

  const isWinner = item.winnerId?._id === currentUser?._id;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
      <img
        src={item.filepath || "/no-image.jpg"}
        alt={item.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 space-y-2">
        <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
        <p className="text-sm text-gray-600">{item.description}</p>

        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Start: ₹{item.startingPrice}</span>
          <span className="text-orange-500">
            {item.isActive && timeLeft ? `⏳ ${timeLeft}` : "Ended"}
          </span>
          <span
            className={`px-2 py-1 text-white text-xs rounded-full ${
              item.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {item.isActive ? "LIVE" : "CLOSED"}
          </span>
        </div>

        <div className="text-blue-600 font-semibold text-lg">
          Current: ₹{bids[0]?.amount || item.currentPrice || item.startingPrice}
        </div>

        {/* Owner or Winner Display */}
        <div className="text-sm text-gray-700">
          {item.isActive ? (
            <p>Owner: {item?.createdBy?.username}</p>
          ) : item.winnerId ? (
            isWinner ? (
              <p className="text-green-600 font-semibold">🏆 You won this auction!</p>
            ) : (
              <p>
                Winner:{" "}
                <span className="font-medium text-gray-800">
                  {item.winnerId?.username}
                </span>
              </p>
            )
          ) : (
            <p className="text-gray-500 italic">No bids placed</p>
          )}
        </div>

        {/* Bidding Input */}
        {item.isActive && (
          <div className="flex gap-2 mt-3">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Your bid"
              className="border border-gray-300 rounded px-3 py-1 w-full focus:outline-none"
            />
            <button
              onClick={handleBid}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Bid
            </button>
          </div>
        )}

        {/* Recent Bids */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-1">Recent Bids</h4>
          <ul className="text-sm text-gray-700 space-y-1 max-h-28 overflow-y-auto border-t pt-2">
            {bids.length > 0 ? (
              bids.map((bid, i) => (
                <li key={i} className="border-b pb-1">
                  ₹{bid.amount} by{" "}
                  <span className="font-medium">{bid.username || bid.userId}</span> @{" "}
                  {new Date(bid.time).toLocaleTimeString()}
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic">No bids yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
