import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userWonAuctionItemAsync } from "../../features/auction/userSlice";
import { toast } from "react-toastify";

const UserWonAuction = () => {
  const dispatch = useDispatch();
  const { userWonItems, loading, error } = useSelector((state) => state.userItem);

  useEffect(() => {
    dispatch(userWonAuctionItemAsync());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center mt-10">Loading won auctions...</div>;
  }

  if (error?.userAuctionWonItemAsync) {
    return <div className="text-center text-red-500">{error.userAuctionWonItemAsync}</div>;
  }

  if (userWonItems.length === 0) {
    return <div className="text-center mt-10">You haven’t won any auctions yet.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-6">🏆 Auctions You Won</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userWonItems.map((item) => (
          <div key={item._id} className="bg-white shadow-md p-4 rounded-lg">
            <img src={item.filepath} className="w-full h-48 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="mt-2 text-green-600 font-bold">You won for ₹{item.currentPrice}</p>
            <p className="text-sm text-gray-500">Owner: {item.createdBy?.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserWonAuction;
