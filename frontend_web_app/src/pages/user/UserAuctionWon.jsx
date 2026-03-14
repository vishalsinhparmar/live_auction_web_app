import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userWonAuctionItemAsync } from "../../features/auction/userSlice";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const UserWonAuction = () => {
  const dispatch = useDispatch();
  const { userWonItems, loading, error } = useSelector((state) => state.userItem);

  useEffect(() => {
    dispatch(userWonAuctionItemAsync());
  }, [dispatch]);

  if (loading.won) {
    return (
      <div className="empty-state">
        <div>
          <div className="loading-ring mx-auto" />
          <p className="mt-5 text-base font-semibold text-stone-700">Loading your won lots...</p>
        </div>
      </div>
    );
  }

  if (error?.userAuctionWonItemAsync) {
    return (
      <div className="empty-state">
        <p className="text-base font-semibold text-red-600">{error.userAuctionWonItemAsync}</p>
      </div>
    );
  }

  if (userWonItems.length === 0) {
    return (
      <div className="empty-state">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">Collected wins</p>
          <h2 className="headline mt-3 text-3xl font-bold text-stone-950">You have not won any auctions yet.</h2>
          <p className="mt-3 text-base text-stone-600">Stay active on live lots and your successful bids will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="page-grid">
      <div className="page-hero glass-panel items-start">
        <div>
          <span className="eyebrow">Won lots</span>
          <h1 className="headline mt-4 text-4xl font-bold text-stone-950 sm:text-5xl">A cleaner record of every auction you secured.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Review the lots you closed successfully, including final price and seller information.
          </p>
        </div>

        <div className="metric-card">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Won auctions</p>
          <p className="mt-2 text-3xl font-extrabold text-stone-950">{userWonItems.length}</p>
          <p className="mt-3 text-sm text-stone-600">Every successful auction appears here after settlement.</p>
        </div>
      </div>

      <div className="auction-grid">
        {userWonItems.map((item) => (
          <article key={item._id} className="auction-card section-card overflow-hidden">
            <div className="auction-card__media">
              <img src={item.filepath} alt={item.title} />
            </div>
            <div className="flex flex-1 flex-col space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="headline text-2xl font-bold text-stone-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
                </div>
                <span className="status-pill status-pill--live">Won</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="metric-card">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Winning price</p>
                  <p className="mt-2 text-lg font-extrabold text-stone-950">{formatCurrency(item.currentPrice)}</p>
                </div>
                <div className="metric-card">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Seller</p>
                  <p className="mt-2 text-lg font-extrabold text-stone-950">{item.createdBy?.username}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default UserWonAuction;
