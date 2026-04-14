import API from "../services/api";

function TaskCard({ task, setTasks, setEditingTask }) {

  // ✅ Mark as completed (API)
  const handleComplete = async () => {
  try {
    await API.put(`/tasks/${task.id}`, {
      ...task,
      status: "completed",
    });

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: "completed" } : t
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  // 🗑️ Delete task (API)
  const handleDelete = async () => {
    try {
      await API.delete(`/tasks/${task.id}`);

      setTasks((prev) =>
        prev.filter((t) => t.id !== task.id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="backdrop-blur-lg bg-white/30 p-4 rounded-xl shadow border border-white/20">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.subject}</p>

      <div className="flex justify-between mt-2 text-sm">
        <span>
          {new Date(task.deadline).toLocaleDateString()}
        </span>

        <span
          className={`px-2 py-1 rounded text-white ${
            task.priority === "high"
              ? "bg-red-500"
              : task.priority === "medium"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex gap-2 mt-4">
        {task.status !== "completed" && (
          <button
            onClick={handleComplete}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Complete
          </button>
        )}
         
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
        <button
  onClick={() => setEditingTask(task)}
  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
>
  Edit
</button>
      </div>

      {task.status === "completed" && (
        <p className="text-green-700 mt-2 text-sm font-semibold">
          ✔ Completed
        </p>
      )}
    </div>
  );
}

export default TaskCard;