import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Nav() {
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const links = [
    { path: "/livesession", title: "Live Session" },
    { path: "/lead", title: "Leaderboard" },
    { path: "/bot", title: "DoubtSolver" },
    
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 12 }}
      className="fixed top-0 left-0 w-full flex justify-between items-center px-10 py-4 
        bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-lg 
        rounded-b-2xl z-50"
    >
      {/* Logo */}
      <NavLink to="/">
        <motion.h1
          whileHover={{ scale: 1.15, rotate: -1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="text-2xl font-extrabold tracking-tight cursor-pointer 
          bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent"
        >
          ClearLens
        </motion.h1>
      </NavLink>

      {/* Links */}
      <div className="flex gap-10 items-center">
        {links.map(({ path, title }) => (
          <NavLink key={path} to={path}>
            {({ isActive }) => (
              <motion.span
                whileHover={{
                  scale: 1.2,
                  y: -2,
                  color: "#2563EB",
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={`text-sm font-medium cursor-pointer px-3 py-1 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:text-blue-500"
                  }`}
              >
                {title}
              </motion.span>
            )}
          </NavLink>
        ))}

        {/* User or Login */}
        {!user ? (
          <NavLink to="/login">
            {({ isActive }) => (
              <motion.span
                whileHover={{
                  scale: 1.2,
                  y: -2,
                  color: "#2563EB",
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={`text-sm font-medium cursor-pointer px-3 py-1 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:text-blue-500"
                  }`}
              >
                Login
              </motion.span>
            )}
          </NavLink>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setTimeout(() => setShowLogout(false), 500)} // delay
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="text-sm font-semibold cursor-pointer px-3 py-1 rounded-lg text-blue-900"
            >
              {user.name}
            </motion.span>

            {showLogout && (
              <motion.button
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                onClick={handleLogout}
                className="absolute top-full mt-2 right-0 bg-white border border-gray-200 shadow-md px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                Log out
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
}
