import { useEffect, useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";

function GroupWorkspace() {
  const { groupId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [chat, setChat] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
    priority: "medium"
  });

  const [message, setMessage] = useState("");

  // 📥 Fetch
  const fetchTasks = async () => {
    const res = await API.get(`/api/groups/task/${groupId}`);
    setTasks(res.data);
  };

  const fetchChat = async () => {
    const res = await API.get(`/api/groups/chat/${groupId}`);
    setChat(res.data);
  };

  useEffect(() => {
    if (groupId) {
      fetchTasks();
      fetchChat();
    }
  }, [groupId]);

  // ➕ Add Task
  const addTask = async () => {
    await API.post(`/api/groups/task/${groupId}`, newTask);
    setNewTask({ title: "", deadline: "", priority: "medium" });
    fetchTasks();
  };

  // 💬 Chat
  const sendMessage = async () => {
    await API.post(`/api/groups/chat/${groupId}`, { message });
    setMessage("");
    fetchChat();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-100 to-purple-100">

      {/* LEFT MAIN */}
      <div className="w-2/3 p-6 overflow-y-auto">

        {/* 🔥 GROUP ACTIONS */}
        <div className="flex gap-4 mb-6">
          <button className="bg-green-500 text-white px-4 py-2 rounded-xl">
            Create Group
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-xl">
            Join Group
          </button>
        </div>

        {/* 📝 ADD TASK FORM */}
        <div className="bg-white/40 backdrop-blur p-4 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Add Group Task</h2>

          <input
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
            className="w-full p-2 mb-2 rounded"
          />

          <input
            type="datetime-local"
            value={newTask.deadline}
            onChange={(e) =>
              setNewTask({ ...newTask, deadline: e.target.value })
            }
            className="w-full p-2 mb-2 rounded"
          />

          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            className="w-full p-2 mb-2 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={addTask}
            className="bg-purple-500 text-white px-4 py-2 rounded-xl w-full"
          >
            Add Task
          </button>
        </div>

        {/* 📋 TASK LIST */}
        <div className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-gray-500">No tasks yet 🚀</p>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-white/50 rounded-xl shadow"
            >
              <h3 className="font-bold">{task.title}</h3>
              <p>📅 {task.deadline}</p>
              <p>🔥 {task.priority}</p>
              <p>Status: {task.status}</p>
            </div>
          ))}
        </div>

        {/* 🏆 LEADERBOARD */}
        <div className="mt-6">
          <button className="w-full bg-yellow-500 text-white p-3 rounded-xl">
            View Leaderboard 🏆
          </button>
        </div>

      </div>

      {/* RIGHT CHAT */}
      <div className="w-1/3 border-l p-4 flex flex-col bg-white/30 backdrop-blur">
        <h2 className="text-xl font-bold mb-2">Group Chat 💬</h2>

        <div className="flex-1 overflow-y-auto mb-2">
          {chat.map((msg) => (
            <div key={msg.id} className="mb-2 bg-white/60 p-2 rounded">
              <strong>User {msg.user_id}:</strong> {msg.message}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-3 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupWorkspace;