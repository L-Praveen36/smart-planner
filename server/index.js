require("dotenv").config();
require("./cron");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");
const db = require("./db");
const JWT_SECRET = "supersecretkey";
const app = express();
const sendReminder = require("./email");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
app.use(cors({
  origin: "https://smart-planner-beta.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/ai-analytics", require("./routes/aiAnalyticsRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));

/* ------------------- ROUTES ------------------- */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // ✅ validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // ✅ check if user exists
    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], async (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // ✅ hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

      db.query(
        insertSql,
        [name, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "User registered successfully" });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Test route
app.get("/tasks", authMiddleware, (req, res) => {
  const userId = req.user.userId;

  const sql = "SELECT * FROM tasks WHERE user_id = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});


// 🔐 LOGIN API (👉 ADD THIS HERE)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
  expiresIn: "7d",
});

    res.json({ token });
  });
});

app.post("/tasks", authMiddleware, (req, res) => {
  const { title, subject, deadline, priority } = req.body;

  const user_id = req.user.userId; // ✅ from token

  const sql =
    "INSERT INTO tasks (user_id, title, subject, deadline, priority, status) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [user_id, title, subject, deadline, priority, "pending"],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Task added" });
      
    }
    
  );
  
});

// app.get("/test-email", async (req, res) => {
//   await sendReminder("your_email@gmail.com", {
//     title: "Test Task",
//     deadline: new Date(),
//     priority: "high",
//   });

//   res.send("Email sent!");
// });

app.put("/tasks/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { title, subject, deadline, priority, status } = req.body;

  const sql = `
    UPDATE tasks 
    SET title=?, subject=?, deadline=?, priority=?, status=? 
    WHERE id=?
  `;

  db.query(
    sql,
    [title, subject, deadline, priority, status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Task updated successfully" });
    }
  );
});

app.delete("/tasks/:id", authMiddleware, (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM tasks WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Task deleted" });
  });
});

app.get("/tasks/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = "SELECT * FROM tasks WHERE user_id = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});
app.get("/me", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const sql = "SELECT id, name, email FROM users WHERE id = ?";

    db.query(sql, [decoded.userId], (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result[0]);
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});
app.put("/update-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { password } = req.body;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const hashed = await bcrypt.hash(password, 10);

    const sql = "UPDATE users SET password=? WHERE id=?";

    db.query(sql, [hashed, decoded.userId], (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Password updated" });
    });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});
app.delete("/delete-account", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const deleteTasks = "DELETE FROM tasks WHERE user_id=?";
    const deleteUser = "DELETE FROM users WHERE id=?";

    db.query(deleteTasks, [decoded.userId], () => {
      db.query(deleteUser, [decoded.userId], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Account deleted" });
      });
    });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});


app.post("/ai-plan", async (req, res) => {
  const { tasks } = req.body;

  const prompt = `
  Suggest a study plan for these tasks:
  ${JSON.stringify(tasks)}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  res.json({ plan: response.choices[0].message.content });
});
/* ------------------- START SERVER ------------------- */

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join group room
  socket.on("joinGroup", (groupId) => {
    socket.join(`group_${groupId}`);
  });

  // Send message
  socket.on("sendMessage", (data) => {
    const { groupId, message, user } = data;

    // Broadcast to group
    io.to(`group_${groupId}`).emit("receiveMessage", {
      message,
      user,
      time: new Date()
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});