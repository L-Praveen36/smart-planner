import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function AddTask() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("low");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !subject || !deadline) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    const res = await API.post("/tasks", {
      title,
      subject,
      deadline,
      priority,
    });

    console.log("ADD RESPONSE:", res.data);

    toast.success("Task added!");

    // clear form
    setTitle("");
    setSubject("");
    setDeadline("");
    setPriority("low");

    navigate("/dashboard");

  } catch (err) {
    console.error(err);
    toast.error("Failed to add task");
  }
};

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-xl w-96 border"
      >
        <h2 className="text-2xl font-bold mb-6">Add Task ✍️</h2>

        <input
          value={title}
          placeholder="Title"
          className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          value={subject}
          placeholder="Subject"
          className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="date"
          value={deadline}
          className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setDeadline(e.target.value)}
        />

        <select
          value={priority}
          className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="w-full bg-blue-600 text-white p-3 rounded">
          Add Task
        </button>
      </form>
    </div>
  );
}

export default AddTask;