const express = require("express");
const router = express.Router();
const { generatePlan } = require("../services/aiService");

router.post("/analyze", async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!tasks || tasks.length === 0) {
      return res.json({ analysis: "No tasks available for analysis." });
    }

    // 🔍 Convert tasks into readable format
    const taskSummary = tasks.map(t => {
      return `${t.title} | ${t.status} | priority: ${t.priority} | deadline: ${t.deadline}`;
    }).join("\n");

    const prompt = `
Act like a productivity analyst.

Analyze the user's task behavior:

${taskSummary}

Give:
1. Productivity summary
2. Missed deadlines (if any)
3. Strengths
4. Weaknesses
5. Suggestions to improve

Keep it simple, structured, and helpful.
`;

    const result = await generatePlan(prompt);

    res.json({ analysis: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

module.exports = router;