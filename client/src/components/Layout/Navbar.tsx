import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-all px-4 py-2 rounded-full relative group ${isActive
      ? "bg-indigo-50 text-indigo-900 shadow-sm ring-1 ring-indigo-100"
      : "text-slate-600 hover:text-indigo-900 hover:bg-slate-50"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-indigo-100 bg-white/60 backdrop-blur-lg">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.jpeg"
            alt="Nirman Textile Logo"
            className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="leading-tight flex flex-col justify-center">
            <h1
              className="text-2xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'San Francisco', 'Helvetica Neue', sans-serif" }}
            >
              NIRMAN TEXTILE
            </h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-medium mt-0.5">
              Bedsheets & Home Linen
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          {!user?.isAdmin && (
            <>
              <NavLink to="/products" className={linkClass}>
                Shop
              </NavLink>
              {user && (
                <NavLink to="/orders" className={linkClass}>
                  My Orders
                </NavLink>
              )}
            </>
          )}
          {user?.isAdmin && (
            <>
              <NavLink to="/admin/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/products" className={linkClass}>
                Products
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!user?.isAdmin && (
            <NavLink
              to="/cart"
              className="relative rounded-full border border-indigo-100 px-5 py-2 text-xs font-semibold text-primary hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm bg-white"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-accent text-white text-[10px] min-w-[18px] h-[18px] shadow-sm">
                  {cartCount}
                </span>
              )}
            </NavLink>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-700">
                Hi, <span className="font-semibold">{user.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-slate-600 hover:text-primary border border-slate-200 rounded-full px-3 py-1.5"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-medium text-slate-700 hover:text-indigo-900 px-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-xs font-bold text-white bg-gradient-to-r from-primary to-indigo-600 hover:to-indigo-500 rounded-full px-5 py-2 shadow-md shadow-indigo-900/20 transition-all hover:scale-105"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

