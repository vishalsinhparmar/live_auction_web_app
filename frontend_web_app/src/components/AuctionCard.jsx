// components/AuctionCard.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { socket } from "../utils/socket";

const AuctionCard = ({ item }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);

  useEffect(() => {
    socket.emit("join-auction", item._id);
    fetchBidHistory();

    socket.on("new-bid", (data) => {
      if (data.auctionId === item._id) {
        setBids((prev) => [data, ...prev]);
         toast.success(`New bid on ${item.title}: ₹${data.amount}`);
      }
    });

socket.on("bid-lessthen", (msg) => {
  toast.warning(msg.message);
});

    socket.on("bid-rejected", (msg) => toast.error(msg.message));

    return () => {
      socket.off("new-bid");
      socket.off("bid-rejected");
    };
  }, [item._id]);

  const fetchBidHistory = async () => {
    try {
      const { data } = await axios.get(`/api/auction/bids/${item._id}`);
      setBids(data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch bid history",err);
    }
  };

  const handleBid = () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) return toast.warning("Enter valid amount");

    socket.emit("place-bid", {
      auctionId: item._id,
      userId: item.createdBy._id,
      amount,
    });

    setBidAmount("");
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-xl font-bold">{item.title}</h2>
      <p className="text-sm text-gray-600">{item.description}</p>
      <img src={item.filepath} alt={item.title} className="h-60 w-full object-cover rounded" />

      <div className="flex justify-between text-sm">
        <span>Start: ₹{item.startingPrice}</span>
        <span
          className={`px-2 py-1 rounded-full text-white text-xs ${
            item.isActive ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {item.isActive ? "LIVE" : "CLOSED"}
        </span>
      </div>

      <div>
        <p className="text-blue-600 font-semibold text-lg">
          Current: ₹{bids[0]?.amount || item.currentPrice || item.startingPrice}
        </p>
      </div>

      <div>
        <p className="text-slate-500 font-semibold text-lg">
          Owner: ₹{item?.createdBy?.username}
        </p>
      </div>

      {item.isActive && (
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter your bid"
            className="border px-3 py-1 rounded w-full"
          />
          <button
            onClick={handleBid}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Bid
          </button>
        </div>
      )}

      {/* 🔁 Bids History */}
      <div className="mt-3">
        <h4 className="text-sm font-semibold mb-1">Recent Bids:</h4>
        <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
          {bids.map((bid, i) => (
            <li key={i} className="border-b pb-1 text-gray-700">
              ₹{bid.amount} by <strong>{bid.username || bid.userId}</strong> @{" "}
              {new Date(bid.time).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuctionCard;
