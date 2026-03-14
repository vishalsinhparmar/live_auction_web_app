import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import AuctionCard from "../../components/AuctionCard";
import { liveAuctionData } from "../../features/auction/auctionSlice";

const LiveAuction = () => {
  const dispatch = useDispatch();
  const { loading, auctionItem } = useSelector((state) => state.auction);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(liveAuctionData());
  }, [dispatch]);

  if (!user) {
    return (
      <section className="page-grid">
        <div className="page-hero glass-panel">
          <div>
            <span className="eyebrow">Private bidding access</span>
            <h1 className="headline mt-4 max-w-xl text-4xl font-bold text-stone-950 sm:text-5xl">
              A refined live-auction room built for serious bidders.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
              Track active lots, respond to real-time bid changes, and manage your seller inventory from one polished dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <NavLink to="/login" className="primary-button">
                Sign in to enter
              </NavLink>
              <NavLink to="/signUp" className="secondary-button">
                Create account
              </NavLink>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="metric-card">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">What you get</p>
              <p className="mt-3 text-lg font-bold text-stone-950">Live lots, instant pricing, seller controls, and win tracking.</p>
            </div>
            <div className="metric-card">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Built for</p>
              <p className="mt-3 text-lg font-bold text-stone-950">Marketplace launches, collectible drops, and timed premium inventory.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const totalLots = auctionItem?.length || 0;
  const activeLots = auctionItem?.filter((item) => item.isActive).length || 0;
  const closingSoon = auctionItem?.filter((item) => item.isActive && item.endTime).length || 0;

  return (
    <section className="page-grid">
      <div className="page-hero glass-panel">
        <div>
          <span className="eyebrow">Marketplace floor</span>
          <h1 className="headline mt-4 text-4xl font-bold text-stone-950 sm:text-5xl">
            Live auctions with a stronger product surface.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Browse active lots, watch prices move in real time, and bid with a clearer view of seller, timing, and settlement status.
          </p>
        </div>

        <div className="inventory-stats sm:grid-cols-3">
          <div className="metric-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Visible lots</p>
            <p className="mt-2 text-3xl font-extrabold text-stone-950">{totalLots}</p>
          </div>
          <div className="metric-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Active now</p>
            <p className="mt-2 text-3xl font-extrabold text-stone-950">{activeLots}</p>
          </div>
          <div className="metric-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Timed lots</p>
            <p className="mt-2 text-3xl font-extrabold text-stone-950">{closingSoon}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div>
            <div className="loading-ring mx-auto" />
            <p className="mt-5 text-base font-semibold text-stone-700">Loading the latest auction feed...</p>
          </div>
        </div>
      ) : auctionItem && auctionItem.length > 0 ? (
        <div className="auction-grid">
          {auctionItem.map((item) => (
            <AuctionCard key={item._id} item={item} currentUser={user} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">No active inventory</p>
            <h2 className="headline mt-3 text-3xl font-bold text-stone-950">The auction floor is quiet right now.</h2>
            <p className="mt-3 max-w-lg text-base text-stone-600">
              No live auction items are available yet. Sellers can create a new listing and start the next session from the seller desk.
            </p>
            <NavLink to="/addAuction" className="primary-button mt-6">
              Create the next lot
            </NavLink>
          </div>
        </div>
      )}
    </section>
  );
};

export default LiveAuction;
