// src/components/HomePage.jsx
import { Link, useNavigate } from "react-router-dom";
import { FaChartLine, FaUserFriends, FaCamera } from "react-icons/fa";
import { motion } from "framer-motion";

// Reusable fade-up animation
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  }),
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="font-sans bg-white text-gray-900 scroll-smooth"
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <section className="text-center py-28 px-6 bg-gradient-to-b from-white to-gray-100">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight"
          variants={fadeUp}
          custom={0}
        >
          Meet <span className="text-blue-900">ClearLens</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto"
          variants={fadeUp}
          custom={1}
        >
          AI-powered focus tracking to help you{" "}
          <span className="font-semibold text-blue-900">stay productive</span>, inspired by simplicity.
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center gap-4"
          variants={fadeUp}
          custom={2}
        >
          {/* Redirect with navigate */}
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-900 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-800 transition transform hover:scale-105"
          >
            Get Started
          </button>

          <Link
            to="/login"
            className="bg-gray-200 text-blue-900 px-8 py-3 rounded-full font-medium hover:bg-gray-300 transition transform hover:scale-105"
          >
            Sign In
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-24 px-6 grid md:grid-cols-3 gap-12 text-center">
        {[
          {
            icon: <FaCamera className="text-blue-900 text-5xl mx-auto mb-6" />,
            title: "Real-Time Focus Detection",
            desc: "Get subtle alerts when your focus drifts, powered by your webcam.",
          },
          {
            icon: <FaChartLine className="text-blue-900 text-5xl mx-auto mb-6" />,
            title: "Detailed Insights",
            desc: "Track your productivity over time with beautiful visual reports.",
          },
          {
            icon: <FaUserFriends className="text-blue-900 text-5xl mx-auto mb-6" />,
            title: "Accountability Rooms",
            desc: "Join live sessions with peers to stay motivated together.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            className="p-10 rounded-2xl border border-gray-200 hover:shadow-xl transition bg-white"
            variants={fadeUp}
            custom={i}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            {feature.icon}
            <h3 className="text-2xl font-semibold text-blue-900">
              {feature.title}
            </h3>
            <p className="mt-4 text-gray-600 text-lg">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-28 px-6 text-center">
        <motion.h2
          className="text-4xl font-bold mb-16 tracking-tight text-blue-900"
          variants={fadeUp}
          custom={0}
        >
          Simple. Powerful. Effortless.
        </motion.h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            {
              step: "1",
              title: "Create Your Account",
              desc: "Sign up in seconds and set up your profile instantly.",
            },
            {
              step: "2",
              title: "Start a Session",
              desc: "Enable CalmCam to track your focus in real-time.",
            },
            {
              step: "3",
              title: "View Insights",
              desc: "Analyze your focus history and boost productivity every day.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp} // ✅ fixed from FaDeaf → fadeUp
              custom={i}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-5xl font-bold text-blue-900 mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-blue-900">
                {item.title}
              </h3>
              <p className="mt-2 text-gray-600 text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 text-center bg-white">
        <motion.h2
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-blue-900"
          variants={fadeUp}
          custom={0}
        >
          Ready to stay focused?
        </motion.h2>

        <motion.p
          className="mt-6 text-lg text-gray-600 max-w-xl mx-auto"
          variants={fadeUp}
          custom={1}
        >
          Start your first CalmCam session today. Designed with simplicity in mind,
          built for focus.
        </motion.p>

        <motion.div variants={fadeUp} custom={2} className="mt-10">
          <Link
            to="/signup"
            className="bg-blue-900 text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-blue-800 transition transform hover:scale-105"
          >
            Sign Up Free
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
}
