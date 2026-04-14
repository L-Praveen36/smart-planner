import { useEffect, useState } from "react";
import API from "../services/api";
import { PieChart, Pie, Cell } from "recharts";
function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);
  
  const generateAnalysis = async () => {
  try {
    setLoading(true);

    const res = await API.post("/api/ai-analytics/analyze", {
      tasks
    });

    setAnalysis(res.data.analysis);

  } catch (err) {
    console.error(err);
    alert("AI analysis failed");
  } finally {
    setLoading(false);
  }
};

  // 📊 Calculations
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status === "pending").length;

  const high = tasks.filter(t => t.priority === "high").length;
  const medium = tasks.filter(t => t.priority === "medium").length;
  const low = tasks.filter(t => t.priority === "low").length;
const data = [
  { name: "Completed", value: completed },
  { name: "Pending", value: pending },
];
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics 📊</h1>
      
      <button
        onClick={generateAnalysis}
        disabled={loading}
        className={`mb-6 px-4 py-2 rounded-lg text-white shadow ${loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"}`}
      >
        {loading ? "Analyzing..." : "🧠 Analyze with AI"}
      </button>

      {loading && (
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white/30 p-4 rounded shadow">
          Total Tasks: {total}
        </div>

        <div className="bg-green-200 p-4 rounded shadow">
          Completed: {completed}
        </div>

        <div className="bg-blue-200 p-4 rounded shadow">
          Pending: {pending}
        </div>

        <div className="bg-red-200 p-4 rounded shadow">
          High Priority: {high}
        </div>

        <div className="bg-yellow-200 p-4 rounded shadow">
          Medium Priority: {medium}
        </div>

        <div className="bg-green-300 p-4 rounded shadow">
          Low Priority: {low}
        </div>
        <PieChart width={300} height={300}>
  <Pie
    data={data}
    dataKey="value"
    outerRadius={100}
    label
  >
    <Cell fill="#4ade80" />
    <Cell fill="#60a5fa" />
  </Pie>
</PieChart>

      </div>

      {analysis && !loading && (
        <div className="mt-8 bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-purple-700 mb-4">
            🧠 AI Productivity Insights
          </h2>
          {analysis.split("\n").map((line, index) => {
            if (
              line.toLowerCase().includes("summary") ||
              line.toLowerCase().includes("strength") ||
              line.toLowerCase().includes("weakness") ||
              line.toLowerCase().includes("suggestion")
            ) {
              return (
                <h3 key={index} className="text-lg font-semibold text-blue-600 mt-3">
                  {line}
                </h3>
              );
            }

            return (
              <p key={index} className="text-gray-700 ml-2">
                {line}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Analytics;