import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../services/api";

function CalendarView() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  // ✅ Safe date comparison
  const isSameDay = (d1, d2) =>
    new Date(d1).toDateString() === new Date(d2).toDateString();

  // ✅ Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // ✅ Filter selected date tasks
  const selectedTasks = tasks.filter((task) =>
    isSameDay(task.deadline, date)
  );

  // ✅ Complete Task
  const handleComplete = async (id) => {
    try {
      await API.put(`/tasks/${id}`, { status: "completed" });

      const updatedTasks = tasks.map((t) =>
        t.id === id ? { ...t, status: "completed" } : t
      );

      setTasks(updatedTasks);
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading calendar...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Calendar 📅</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 📅 Calendar */}
        <div className="bg-white/30 p-4 rounded-xl shadow">
          <Calendar
            onChange={setDate}
            value={date}
           tileClassName={({ date }) => {
  const tasksForDate = tasks.filter(
    (task) =>
      task.status !== "completed" &&
      new Date(task.deadline).toDateString() ===
        date.toDateString()
  );

  if (tasksForDate.length === 0) return null;

  const priorityOrder = { high: 3, medium: 2, low: 1 };

  const highest = tasksForDate.sort(
    (a, b) =>
      priorityOrder[b.priority] - priorityOrder[a.priority]
  )[0];

  if (highest.priority === "high") return "high-priority";
  if (highest.priority === "medium") return "medium-priority";
  return "low-priority";

            }}
          />
        </div>

        {/* 📋 Tasks */}
        <div className="bg-white/30 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Tasks on {date.toDateString()}
          </h2>

          {selectedTasks.length === 0 ? (
            <p className="text-gray-600">No tasks</p>
          ) : (
            selectedTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="border-b py-2 cursor-pointer hover:bg-gray-100 rounded"
              >
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-gray-600">
                  {task.subject}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">

            <h2 className="text-xl font-bold mb-2">
              {selectedTask.title}
            </h2>

            <p className="text-gray-600 mb-2">
              Subject: {selectedTask.subject}
            </p>

            <p className="text-gray-600 mb-2">
              Deadline:{" "}
              {new Date(selectedTask.deadline).toLocaleDateString()}
            </p>

            <p className="mb-2">
              Priority:{" "}
              <span className="font-semibold">
                {selectedTask.priority}
              </span>
            </p>

            <p className="mb-4">
              Status:{" "}
              <span className="font-semibold">
                {selectedTask.status}
              </span>
            </p>

            <div className="flex gap-2">
              {selectedTask.status !== "completed" && (
                <button
                  onClick={() => handleComplete(selectedTask.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Complete
                </button>
              )}

              <button
                onClick={() => setSelectedTask(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;