// utils/authMiddleware.js

const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "🔒 No token provided in Authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token ❌",
    });
  }
};

// ✅ Middleware: Restrict Access to Admins
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({
      success: false,
      error: "🚫 Access denied — Admins only",
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
