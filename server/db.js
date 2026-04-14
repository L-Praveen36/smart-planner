require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,   // ✅ IMPORTANT FIX

  ssl: {
    rejectUnauthorized: false
  },

  waitForConnections: true,
  connectionLimit: 10
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed ❌:", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

module.exports = db;