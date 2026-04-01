import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, isPremium, role } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/public-lessons", label: "Public Lessons" },
    ...(user
      ? [
          { to: "/dashboard/add-lesson", label: "Add Lesson" },
          { to: "/dashboard/my-lessons", label: "My Lessons" },
          ...(role !== "admin" && !isPremium ? [{ to: "/pricing", label: "Pricing" }] : []),
        ]
      : []),
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span className="text-xl font-bold text-indigo-700">LifeLessons</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth Buttons / Avatar */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={user.photoURL || "https://i.ibb.co/placeholder.png"}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-400"
                />
                {isPremium && (
                  <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
                    Premium ⭐
                  </span>
                )}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <p className="px-4 py-2 text-sm font-semibold text-gray-800 border-b">
                    {user.displayName}
                  </p>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50"
                  >
                    Profile
                  </Link>
                  <Link
                    to={role === "admin" ? "/dashboard/admin" : "/dashboard"}
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-gray-600 hover:text-indigo-600"
            >
              {link.label}
            </NavLink>
          ))}
          {!user ? (
            <div className="flex gap-2 mt-2">
              <Link to="/login" className="flex-1 text-center py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm">
                Login
              </Link>
              <Link to="/register" className="flex-1 text-center py-2 bg-indigo-600 text-white rounded-lg text-sm">
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="mt-2 w-full text-sm text-red-500 border border-red-300 py-2 rounded-lg"
            >
              Log Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;