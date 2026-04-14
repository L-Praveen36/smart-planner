import { useEffect, useState } from "react";
import API from "../services/api";

function Leaderboard({ groupId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await API.get(`/api/groups/${groupId}/leaderboard`);
      setUsers(res.data);
    };

    fetchLeaderboard();
  }, [groupId]);

  return (
    <div className="mt-6 bg-white/50 p-4 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>

      {users.map((user, index) => (
        <div
          key={user.id}
          className={`flex justify-between p-3 mb-2 rounded ${
            index === 0
              ? "bg-yellow-300"
              : index === 1
              ? "bg-gray-300"
              : index === 2
              ? "bg-orange-300"
              : "bg-white"
          }`}
        >
          <span>
            {index === 0 && "🥇"}
            {index === 1 && "🥈"}
            {index === 2 && "🥉"} {user.name}
          </span>

          <span>{user.points} pts</span>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;