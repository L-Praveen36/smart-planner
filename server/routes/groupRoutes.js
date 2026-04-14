const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/auth");

// CREATE GROUP
router.post("/create", authMiddleware, (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  const sql = "INSERT INTO user_groups (name, created_by) VALUES (?, ?)";

  db.query(sql, [name, userId], (err, result) => {
    if (err) return res.status(500).json(err);

    const groupId = result.insertId;

    // auto add creator as member
    db.query(
      "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
      [groupId, userId]
    );

    res.json({ message: "Group created", groupId });
  });
});

// JOIN GROUP
router.post("/join/:groupId", authMiddleware, (req, res) => {
  const userId = req.user.userId;
  const { groupId } = req.params;

  const sql =
    "INSERT IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)";

  db.query(sql, [groupId, userId], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Joined group" });
  });
});

// GET USER GROUPS
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT g.* 
    FROM user_groups g
    JOIN group_members gm ON g.id = gm.group_id
    WHERE gm.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

// ADD GROUP TASK
router.post("/task/:groupId", authMiddleware, (req, res) => {
  const { title, deadline, priority } = req.body;
  const { groupId } = req.params;

  const sql = `
    INSERT INTO group_tasks (group_id, title, deadline, priority)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [groupId, title, deadline, priority], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Task added" });
  });
});

// GET GROUP TASKS
router.get("/task/:groupId", authMiddleware, (req, res) => {
  const { groupId } = req.params;

  const sql = "SELECT * FROM group_tasks WHERE group_id = ?";

  db.query(sql, [groupId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

// COMPLETE TASK
router.put("/task/:taskId/complete", authMiddleware, (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.userId;

  const updateTask = `
    UPDATE group_tasks 
    SET status='completed', completed_by=? 
    WHERE id=?
  `;

  db.query(updateTask, [userId, taskId], (err) => {
    if (err) return res.status(500).json(err);

    // 🎯 Add points
    db.query(
      "UPDATE users SET points = points + 10 WHERE id=?",
      [userId]
    );

    res.json({ message: "Task completed + points added" });
  });
});

// SEND MESSAGE
router.post("/chat/:groupId", authMiddleware, (req, res) => {
  const { message } = req.body;
  const { groupId } = req.params;
  const userId = req.user.userId;

  const sql = `
    INSERT INTO group_messages (group_id, user_id, message)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [groupId, userId, message], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Message sent" });
  });
});

// GET CHAT
router.get("/chat/:groupId", authMiddleware, (req, res) => {
  const { groupId } = req.params;

  const sql = `
    SELECT gm.*, u.name 
    FROM group_messages gm
    JOIN users u ON gm.user_id = u.id
    WHERE gm.group_id = ?
    ORDER BY gm.created_at ASC
  `;

  db.query(sql, [groupId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

// LEADERBOARD
router.get("/leaderboard/:groupId", authMiddleware, (req, res) => {
  const { groupId } = req.params;

  const sql = `
    SELECT u.name, u.points 
    FROM users u
    JOIN group_members gm ON u.id = gm.user_id
    WHERE gm.group_id = ?
    ORDER BY u.points DESC
  `;

  db.query(sql, [groupId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});
module.exports = router;