import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function Profile() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  // 🔹 Fetch user info
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await API.get("/me");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      console.log("PROFILE TASKS:", res.data); // debug
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchUser();
  fetchTasks();
}, []);

if (loading) return <p>Loading...</p>;
if (!user) return <p>Error loading profile</p>;

  // 🔹 Update password
  const handlePasswordUpdate = async () => {
    try {
      await API.put("/update-password", {
        password: newPassword,
      });

      toast.success("Password updated 🔐");
      setNewPassword("");
    } catch (err) {
      toast.error("Failed to update password");
    }
  };

  // 🔹 Delete account
  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete("/delete-account");

      localStorage.removeItem("token");
      toast.success("Account deleted");

      window.location.href = "/";
    } catch (err) {
      toast.error("Error deleting account");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Profile 👤</h1>

      {/* USER INFO */}
      <div className="bg-white/30 p-4 rounded mb-6">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>

      {/* PASSWORD UPDATE */}
      <div className="bg-white/30 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Update Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="p-2 border rounded mr-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handlePasswordUpdate}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Update
        </button>
      </div>

      {/* TASKS */}
      <div className="bg-white/30 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Your Tasks</h2>

        {!tasks || tasks.length === 0 ? (
  <p>No tasks</p>
) : (
  tasks.map((task) => (
    <div key={task.id} className="border-b py-3">
      
      <p className="font-semibold text-lg">{task.title}</p>

      <p className="text-sm text-gray-600">
        Subject: {task.subject}
      </p>

      <p className="text-sm">
        Deadline: {new Date(task.deadline).toLocaleDateString()}
      </p>

      <p
        className={`text-sm font-medium ${
          task.priority === "high"
            ? "text-red-600"
            : task.priority === "medium"
            ? "text-yellow-600"
            : "text-green-600"
        }`}
      >
        Priority: {task.priority}
      </p>

      <p
        className={`text-sm font-semibold ${
          task.status === "completed"
            ? "text-green-700"
            : "text-blue-700"
        }`}
      >
        Status: {task.status}
      </p>

    </div>
  ))
)}
      </div>

      {/* DELETE ACCOUNT */}
      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Delete Account ❌
      </button>
    </div>
  );
}

export default Profile;