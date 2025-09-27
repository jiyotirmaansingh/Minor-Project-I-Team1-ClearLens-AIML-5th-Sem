import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:8080/auth/signup", form);

      if (res.data.success) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("User already exists! Please login.");
      } else {
        setError("Signup failed. Try again.");
      }
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
          Create Account
        </h2>

        {error && (
          <p className="text-red-600 bg-red-100 border border-red-200 rounded-lg py-2 px-3 mb-4 text-sm text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 bg-green-100 border border-green-200 rounded-lg py-2 px-3 mb-4 text-sm text-center">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
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
            Sign Up
          </motion.button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-900 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
