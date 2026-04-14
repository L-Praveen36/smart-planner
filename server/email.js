require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminder = async (to, task) => {
  await transporter.sendMail({
    from: "Smart Planner",
    to,
    subject: "Task Reminder ⏰",
    html: `
      <h3>Reminder!</h3>
      <p>Your task <b>${task.title}</b> is due on ${task.deadline}</p>
      <p>Priority: ${task.priority}</p>
    `,
  });
};

module.exports = sendReminder;