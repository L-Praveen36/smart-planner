import { useEffect, useState } from "react";
import API from "../services/api";

function AIPlanner() {
  const [tasks, setTasks] = useState([]);
  const [suggestion, setSuggestion] = useState("");
//const [hours, setHours] = useState("");
//const [deadline, setDeadline] = useState("");
const [plan, setPlan] = useState("");
const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await API.get("/tasks");
      setTasks(res.data);
    };

    fetchTasks();
  }, []);

  // ✅ HERE
 const generateAIPlan = async () => {
  try {
    setLoading(true);

    const res = await API.post("/api/ai/generate-plan", {
      tasks,
      hours
    });

    setPlan(res.data.plan);

  } catch (err) {
    console.error(err);
    alert("AI failed");
  } finally {
    setLoading(false);
  }
};

  const generatePlan = () => {
  if (!tasks || tasks.length === 0) {
    setSuggestion("No tasks available.");
    return;
  }

  const now = new Date();

  const pending = tasks.filter(t => t.status === "pending");

  if (pending.length === 0) {
    setSuggestion("🎉 All tasks completed! Great job!");
    return;
  }

  // 🚨 Overdue tasks
  const overdue = pending.filter(
    t => new Date(t.deadline) < now
  );

  // 🔥 High priority
  const highPriority = pending.filter(
    t => t.priority === "high"
  );

  // ⏳ Sort by deadline
  const sorted = [...pending].sort(
    (a, b) => new Date(a.deadline) - new Date(b.deadline)
  );

  let message = "";

  // 🚨 Rule 1: Overdue first
  if (overdue.length > 0) {
    message += `⚠️ You have overdue tasks: ${overdue
      .map(t => t.title)
      .join(", ")}.\n\n`;
  }

  // 🔥 Rule 2: High priority
  if (highPriority.length > 0) {
    message += `🔥 Focus on high priority tasks: ${highPriority
      .map(t => t.title)
      .join(", ")}.\n\n`;
  }

  // ⏳ Rule 3: Next task
  message += `👉 Start with: ${sorted[0].title}\n\n`;

  // 📅 Mini plan
  message += `📅 Suggested plan:\n`;

  sorted.slice(0, 3).forEach((task, index) => {
    message += `${index + 1}. ${task.title} (${task.priority})\n`;
  });

  setSuggestion(message);
};

  return (
  <div className="p-6 max-w-3xl mx-auto">

    {/* Buttons */}
    <div className="flex gap-4 mb-6">
      <button
        onClick={generatePlan}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow"
      >
        Rule Plan
      </button>

      <button
        onClick={generateAIPlan}
        disabled={loading}
        className={`px-4 py-2 rounded-lg shadow text-white 
        ${loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"}`}
      >
        {loading ? "Generating..." : "Generate AI Plan"}
      </button>
    </div>

    {/* 🔄 LOADING UI */}
    {loading && (
      <div className="flex justify-center items-center mt-10">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )}

    {/* 🤖 AI PLAN OUTPUT */}
    {!loading && plan && (
      <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg space-y-3">
        <h2 className="text-xl font-bold text-purple-700 mb-3">
          🧠 AI Generated Plan
        </h2>

        {plan.split("\n").map((line, index) => {
          // Highlight Day headings
          if (line.toLowerCase().includes("day")) {
            return (
              <h3
                key={index}
                className="text-lg font-semibold text-blue-600 mt-4"
              >
                {line}
              </h3>
            );
          }

          // Bullet points
          if (line.includes("-")) {
            return (
              <p key={index} className="ml-4 text-gray-700">
                • {line.replace("-", "").trim()}
              </p>
            );
          }

          return (
            <p key={index} className="text-gray-600">
              {line}
            </p>
          );
        })}
      </div>
    )}

    {/* RULE BASED OUTPUT */}
    {suggestion && (
      <div className="mt-6 p-4 bg-white/40 rounded-xl shadow whitespace-pre-line">
        {suggestion}
      </div>
    )}
  </div>
);
}

export default AIPlanner;