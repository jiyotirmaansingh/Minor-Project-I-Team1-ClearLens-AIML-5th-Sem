import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/auth/login", form);

      if (res.data.success) {
        localStorage.setItem("token", res.data.jwtToken);
        localStorage.setItem(
          "user",
          JSON.stringify({ name: res.data.name, email: res.data.email })
        );

        navigate("/"); // redirect home
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-lg p-10 border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-6">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-600 bg-red-100 border border-red-200 rounded-lg py-2 px-3 mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full p-3 rounded-xl font-semibold bg-blue-900 text-white hover:bg-blue-800 transition"
          >
            Login
          </motion.button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-900 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
