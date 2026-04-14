const cron = require("node-cron");
const db = require("./db");
const sendReminder = require("./email");

cron.schedule("0 9 * * *", () => {
  console.log("Running daily reminder job...");

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const sql = `
    SELECT tasks.*, users.email 
    FROM tasks 
    JOIN users ON tasks.user_id = users.id
    WHERE DATE(deadline) = DATE(?)
    AND status = 'pending'
  `;

  db.query(sql, [tomorrow], async (err, results) => {
    if (err) return console.error(err);

    for (const task of results) {
      await sendReminder(task.email, task);
    }
  });
});