import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { socket } from "../utils/socket";
import { fetchBidData } from "../services/services";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatTimeLeft = (endTime) => {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) {
    return "Auction ended";
  }

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
};

const AuctionCard = ({ item, currentUser }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    socket.emit("join-auction", item._id);
    fetchBidHistory();

    const handleNewBid = (data) => {
      if (data.auctionId === item._id) {
        setBids((prev) => [data, ...prev]);
        toast.success(`New bid on ${item.title}: ${formatCurrency(data.amount)}`);
      }
    };

    const handleBidLessThan = (msg) => toast.warning(msg.message);
    const handleBidRejected = (msg) => toast.error(msg.message);

    socket.on("new-bid", handleNewBid);
    socket.on("bid-lessthen", handleBidLessThan);
    socket.on("bid-rejected", handleBidRejected);

    return () => {
      socket.off("new-bid", handleNewBid);
      socket.off("bid-lessthen", handleBidLessThan);
      socket.off("bid-rejected", handleBidRejected);
    };
  }, [item._id, item.title]);

  useEffect(() => {
    if (!item.isActive || !item.endTime) return;

    const updateTime = () => {
      setTimeLeft(formatTimeLeft(item.endTime));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [item.endTime, item.isActive]);

  const fetchBidHistory = async () => {
    try {
      const { data } = await fetchBidData(item._id);
      setBids(data || []);
    } catch {
      toast.error("Failed to fetch bid history");
    }
  };

  const handleBid = () => {
    const amount = parseFloat(bidAmount);

    if (!amount || amount <= 0) {
      toast.warning("Enter a valid bid");
      return;
    }

    socket.emit("place-bid", {
      auctionId: item._id,
      userId: currentUser._id,
      amount,
    });

    setBidAmount("");
  };

  const latestBid = bids[0]?.amount || item.currentPrice || item.startingPrice;
  const isWinner = item.winnerId?._id === currentUser?._id;

  return (
    <article className="auction-card section-card overflow-hidden">
      <div className="auction-card__media">
        <img
          src={item.filepath || "/no-image.jpg"}
          alt={item.title}
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className={`status-pill ${item.isActive ? "status-pill--live" : "status-pill--closed"}`}>
            {item.isActive ? "Live now" : "Closed"}
          </span>
          <div className="rounded-full bg-stone-950/78 px-3 py-2 text-right text-xs font-semibold text-white shadow-lg backdrop-blur">
            <p className="uppercase tracking-[0.18em] text-white/60">Current</p>
            <p className="mt-0.5 text-sm font-bold">{formatCurrency(latestBid)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="headline text-2xl font-bold text-stone-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="metric-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Start price</p>
            <p className="mt-2 text-lg font-extrabold text-stone-950">{formatCurrency(item.startingPrice)}</p>
          </div>
          <div className="metric-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Countdown</p>
            <p className="mt-2 text-lg font-extrabold text-stone-950">
              {item.isActive ? timeLeft || "Syncing..." : "Completed"}
            </p>
          </div>
        </div>

        <div className="rounded-[22px] bg-stone-950 px-4 py-4 text-stone-50">
          {item.isActive ? (
            <>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-300">Seller</p>
              <p className="mt-1 text-lg font-bold">{item?.createdBy?.username || "Unknown seller"}</p>
              <p className="mt-2 text-sm text-stone-300">Highest compliant bid wins when the lot closes.</p>
            </>
          ) : item.winnerId ? (
            <>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-300">Winner</p>
              <p className="mt-1 text-lg font-bold">{item.winnerId?.username}</p>
              <p className="mt-2 text-sm text-stone-300">
                {isWinner ? "This lot closed in your favor." : "Auction settled with a winning bidder."}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-300">Result</p>
              <p className="mt-1 text-lg font-bold">No winning bid</p>
              <p className="mt-2 text-sm text-stone-300">The auction closed without any qualifying offers.</p>
            </>
          )}
        </div>

        {item.isActive && (
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <input
              type="number"
              value={bidAmount}
              onChange={(event) => setBidAmount(event.target.value)}
              placeholder="Enter your bid amount"
              className="field-control"
            />
            <button onClick={handleBid} className="primary-button sm:min-w-32">
              Place bid
            </button>
          </div>
        )}

        <div className="rounded-[22px] border border-stone-900/10 bg-white/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-extrabold uppercase tracking-[0.18em] text-stone-500">
              Bid activity
            </h4>
            <span className="text-xs font-semibold text-stone-400">{bids.length} updates</span>
          </div>

          <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
            {bids.length > 0 ? (
              bids.map((bid, index) => (
                <div
                  key={`${bid.time}-${index}`}
                  className={`rounded-2xl border px-3 py-3 ${
                    index === 0
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-stone-900/8 bg-stone-50/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-stone-900">{formatCurrency(bid.amount)}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                      {index === 0 ? (item.isActive ? "Highest" : "Winning") : "Bid"}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-stone-600">
                    {bid.username || bid.userId} at {new Date(bid.time).toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-stone-50 px-4 py-6 text-sm text-stone-500">
                No bids yet for this lot.
              </p>
            )}
          </div>
        </div>

        {!item.isActive && item.winnerId && (
          <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Settlement</p>
            <p className="mt-2 text-base font-bold text-emerald-950">
              {item.winnerId?.username} secured the lot for {formatCurrency(latestBid)}.
            </p>
            {isWinner && <p className="mt-1 text-sm text-emerald-700">This auction is recorded as one you won.</p>}
          </div>
        )}
      </div>
    </article>
  );
};

export default AuctionCard;
