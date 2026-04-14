import TaskCard from "../components/TaskCard";
import { useEffect, useState } from "react";
import API from "../services/api";
import EditTaskModal from "../components/EditTaskModal";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [editingTask, setEditingTask] = useState(null);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log("Fetching tasks...");
        const res = await API.get("/tasks"); // ✅ FIXED
        console.log("TASKS:", res.data); 
        console.log(res.data);

        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false); // ✅ FIXED
      }
    };

    fetchTasks();
  }, []);

  const completed = tasks.filter((t) => t.status === "completed");
  const pending = tasks.filter((t) => t.status === "pending");

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  const filteredTasks = tasks
  .filter((task) => {
    const title = task.title || "";
    const subject = task.subject || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      subject.toLowerCase().includes(search.toLowerCase());

    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;

    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  })
    .sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline) - new Date(b.deadline);
      }

      if (sortBy === "priority") {
        const order = { high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }

      return 0;
    });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard 📊</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/30 p-4 rounded">
          Completed: {completed.length}
        </div>
        <div className="bg-white/30 p-4 rounded">Pending: {pending.length}</div>
        <div className="bg-white/30 p-4 rounded">Total: {tasks.length}</div>
      </div>
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          className="p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 🎯 Filter by Priority */}
        <select
          className="p-2 border rounded"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* ✅ Filter by Status */}
        <select
          className="p-2 border rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        {/* 🔄 Sort */}
        <select
          className="p-2 border rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="none">No Sorting</option>
          <option value="deadline">Sort by Deadline</option>
          <option value="priority">Sort by Priority</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setFilterPriority("all");
            setFilterStatus("all");
            setSortBy("none");
          }}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Reset
        </button>
      </div>
      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No tasks found 😢</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              setTasks={setTasks}
              setEditingTask={setEditingTask}
            />
          ))}
        </div>
      )}
      {editingTask && (
  <EditTaskModal
    task={editingTask}
    setEditingTask={setEditingTask}
    tasks={tasks}
    setTasks={setTasks}
  />
)}
    </div>
  );
}

export default Dashboard;
