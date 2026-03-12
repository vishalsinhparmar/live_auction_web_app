import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-700"} hover:text-blue-700 transition`;

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const token = useMemo(() => localStorage.getItem("authToken"), []);

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

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <nav className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition">
            🏠 AuctionLive
          </NavLink>
          <div className="hidden md:flex gap-4">
            <NavLink to="/addAuction" className={navLinkClass}>
              Add Auction
            </NavLink>
            <NavLink to="/" className={navLinkClass}>
              Live Auctions
            </NavLink>
            <NavLink to="/won_Auction" className={navLinkClass}>
              Won Auctions
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <NavLink to="/signUp" className={navLinkClass}>
                Sign Up
              </NavLink>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                to="/user"
                className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
                title={user.username}
              >
                {getInitial(user.username)}
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-md transition"
              >
                Logout
              </button>
            </div>
          )}

          <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen((prev) => !prev)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 border-t border-gray-100 bg-white">
          <NavLink to="/addAuction" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
            Add Auction
          </NavLink>
          <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
            Live Auctions
          </NavLink>
          <NavLink to="/won_Auction" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
            Won Auctions
          </NavLink>
          {!user ? (
            <>
              <NavLink to="/signUp" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </NavLink>
              <NavLink to="/login" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                Login
              </NavLink>
            </>
          ) : (
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
