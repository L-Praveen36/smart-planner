let lastCall = 0;
const express = require("express");
const router = express.Router();
const { generatePlan } = require("../services/aiService");

router.post("/generate-plan", async (req, res) => {
  try {
    // ⏱ Rate limit
    if (Date.now() - lastCall < 2000) {
      return res.status(429).json({ error: "Too fast" });
    }
    lastCall = Date.now();

    const { tasks: userTasks, hours } = req.body;

    // ❗ Validate
    if (!userTasks || userTasks.length === 0) {
      return res.status(400).json({ error: "No tasks provided" });
    }

    // ✅ Only pending tasks
    const pendingTasks = userTasks.filter(t => t.status === "pending");

    // 🧠 Format tasks for AI
    const taskList = pendingTasks.map(t => {
      const date = new Date(t.deadline).toDateString();
      return `${t.title} (priority: ${t.priority}, deadline: ${date})`;
    }).join("\n");

    const prompt = `
Act like a smart productivity planner.

User has the following tasks:
${taskList}

Available hours per day: ${hours || "not specified"}

Instructions:
- Prioritize urgent and high priority tasks
- Consider deadlines
- Balance workload
- Create a clear daily execution plan

Format:
Day 1:
- Task name (X hrs)
`;

    const result = await generatePlan(prompt);

    // 🔄 Parse AI output
    const parsedTasks = [];
    let currentDay = "";

    result.split("\n").forEach(line => {
      const clean = line.trim();

      if (clean.toLowerCase().startsWith("day")) {
        currentDay = clean;
      } else if (clean.startsWith("-")) {
        const taskText = clean.replace("-", "").trim();

        parsedTasks.push({
          title: taskText,
          day: currentDay
        });
      }
    });

    res.json({ plan: result, tasks: parsedTasks });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

module.exports = router;