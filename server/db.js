require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection(process.env.DB_URL);

db.connect((err) => {
  if (err) {
    console.error("DB connection failed ❌", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

module.exports = db;