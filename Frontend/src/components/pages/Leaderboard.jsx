import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/leaderboard")
      .then((res) => setLeaders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white pt-28 px-6">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-blue-900 mb-10">
        Leaderboard
      </h1>

      {/* Card container */}
      <div className="w-full max-w-2xl bg-gray-50 rounded-2xl shadow-lg p-6">
        <ul className="space-y-4">
          {leaders.map((user, i) => (
            <li
              key={i}
              className="flex justify-between items-center p-4 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <span className="font-semibold text-gray-800">
                {i + 1}. {user.name}
              </span>
              <span className="text-blue-600 font-bold">{user.score} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
