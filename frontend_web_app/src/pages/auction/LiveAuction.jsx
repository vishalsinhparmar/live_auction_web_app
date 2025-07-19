// pages/LiveAuction.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { liveAuctionData} from "../../features/auction/auctionSlice";
import AuctionCard from "../../components/AuctionCard";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";


const LiveAuction = () => {
  const dispatch = useDispatch();
  const { loading, auctionItem } = useSelector((state) => state.auction);
  const {user } = useSelector((state) => state.auth); 
  const navigate = useNavigate();
  useEffect(() => {

      dispatch(liveAuctionData());
    //  dispatch(resetLIveAuction());
    }, [dispatch, user, navigate]);
  if(!user){
     return <p className="text-center text-red-500">please login first<NavLink to='/login' className='text-blue-500 mx-2'>Login</NavLink></p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {loading ? (
        <p>Loading...</p>
      ) : (
        auctionItem?.map((item) => <AuctionCard key={item._id} item={item} />)
      )}
    </div>
  );
};

export default LiveAuction;
