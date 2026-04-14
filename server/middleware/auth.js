const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey";


const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // ✅ FIXED
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message); // debug
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;

