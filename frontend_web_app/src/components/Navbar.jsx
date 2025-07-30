import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken");
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (token && !user) {
      dispatch(loginUser());
    }
  }, [token, dispatch, user]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    window.location.reload();
  };

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
            🏠 AuctionLive
          </NavLink>
          <div className="hidden md:flex gap-4">
            <NavLink
              to="/addAuction"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-blue-600" : "text-gray-700"
                } hover:text-blue-700`
              }
            >
              Add Auction
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-blue-600" : "text-gray-700"
                } hover:text-blue-700`
              }
            >
              Live Auctions
            </NavLink>
                      <NavLink
            to="/won_Auction"
            className="block text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Won Auctions
          </NavLink>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <NavLink
                to="/signUp"
                className="text-sm font-medium text-gray-700 hover:text-blue-700"
              >
                Sign Up
              </NavLink>
              <NavLink
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-blue-700"
              >
                Login
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink
                to="/user"
                className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700"
              >
                {getInitial(user.username)}
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded transition"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <NavLink
            to="/addAuction"
            className="block text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Add Auction
          </NavLink>
          <NavLink
            to="/"
            className="block text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Live Auctions
          </NavLink>
          <NavLink
            to="/won_Auction"
            className="block text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Won Auctions
          </NavLink>
          {!user && (
            <>
              <NavLink
                to="/signUp"
                className="block text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Sign Up
              </NavLink>
              <NavLink
                to="/login"
                className="block text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Login
              </NavLink>
            </>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="block w-full text-left text-sm font-medium text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
