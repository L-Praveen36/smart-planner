import { useState } from "react";
import API from "../services/api";

function EditTaskModal({ task, setEditingTask, tasks, setTasks }) {
  const [title, setTitle] = useState(task.title);
  const [subject, setSubject] = useState(task.subject);
  const [deadline, setDeadline] = useState(
    task.deadline ? task.deadline.split("T")[0] : ""
  );
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);

  const handleUpdate = async () => {
    try {
      const res = await API.put(`/tasks/${task.id}`, {
        title,
        subject,
        deadline,
        priority,
        status,
      });

      console.log("UPDATED:", res.data);

      const updatedTasks = tasks.map((t) =>
        t.id === task.id
          ? { ...t, title, subject, deadline, priority, status }
          : t
      );

      setTasks(updatedTasks);
      setEditingTask(null);

    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96">

        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Update
          </button>

          <button
            onClick={() => setEditingTask(null)}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditTaskModal;