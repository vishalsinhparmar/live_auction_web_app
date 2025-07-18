import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate} from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
 
  useEffect(() => {
    if (token && !user) {
      dispatch(loginUser());
    }
  }, [token, dispatch, user]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate('/login')
    window.location.reload(); 
  };

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-blue-100 shadow-2xl p-4">
      <ul className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <li>
            <NavLink to="/addAuction" className="text-lg font-semibold hover:underline">
              addAuctionitem
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="text-lg font-semibold hover:underline">
              liveAuction
            </NavLink>
          </li>
          {!user && (
            <>
              <li>
                <NavLink to="/signUp" className="text-lg font-semibold hover:underline">
                  SignUp
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className="text-lg font-semibold hover:underline">
                  Login
                </NavLink>
              </li>
            </>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xl" >
              <NavLink to='/user'><span>{getInitial(user.username)}</span></NavLink>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;