import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";

const links = [
  { to: "/", label: "Live auctions" },
  { to: "/addAuction", label: "Create listing" },
  { to: "/user", label: "Seller desk" },
  { to: "/won_Auction", label: "Won lots" },
];

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
  }, [dispatch, token, user]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    window.location.reload();
  };

  const renderLink = ({ to, label }) => (
    <NavLink
      key={to}
      to={to}
      onClick={() => setIsMenuOpen(false)}
      className={({ isActive }) =>
        [
          "rounded-full px-4 py-2 text-sm font-semibold transition",
          isActive
            ? "bg-white text-stone-950 shadow-sm"
            : "text-stone-600 hover:bg-white/70 hover:text-stone-900",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );

  return (
    <header className="relative z-10 px-3 pt-3 sm:px-0">
      <nav className="glass-panel mx-auto flex w-full max-w-[1220px] items-center justify-between rounded-[28px] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-stone-950 text-sm font-extrabold uppercase tracking-[0.28em] text-white">
              AL
            </div>
            <div>
              <p className="headline text-lg font-bold text-stone-950">AuctionLive</p>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                Curated real-time bidding
              </p>
            </div>
          </NavLink>

          <div className="ml-6 hidden items-center gap-1 rounded-full bg-stone-900/5 p-1 lg:flex">
            {links.map(renderLink)}
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {!user ? (
            <>
              <NavLink to="/signUp" className="secondary-button">
                Create account
              </NavLink>
              <NavLink to="/login" className="primary-button">
                Sign in
              </NavLink>
            </>
          ) : (
            <>
              <div className="rounded-full border border-stone-900/10 bg-white/70 px-4 py-2 text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Signed in</p>
                <p className="text-sm font-bold text-stone-900">{user.username}</p>
              </div>
              <NavLink
                to="/user"
                className="grid h-12 w-12 place-items-center rounded-full bg-[var(--accent)] text-sm font-bold text-white"
              >
                {user.username?.charAt(0)?.toUpperCase() || "U"}
              </NavLink>
              <button onClick={handleLogout} className="secondary-button">
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-stone-900/10 bg-white/70 text-stone-900 lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="space-y-1">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="glass-panel mx-auto mt-3 flex w-full max-w-[1220px] flex-col gap-2 rounded-[24px] px-4 py-4 lg:hidden">
          {links.map(renderLink)}
          <div className="mt-2 grid gap-2 border-t border-stone-900/10 pt-3">
            {!user ? (
              <>
                <NavLink to="/signUp" onClick={() => setIsMenuOpen(false)} className="secondary-button">
                  Create account
                </NavLink>
                <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="primary-button">
                  Sign in
                </NavLink>
              </>
            ) : (
              <>
                <div className="rounded-2xl bg-white/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Signed in</p>
                  <p className="text-base font-bold text-stone-900">{user.username}</p>
                </div>
                <button onClick={handleLogout} className="secondary-button">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
