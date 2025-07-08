// routes/authRoutes.js

const express = require("express");
const router = express.Router();

// 🔁 Controllers
const {
  register,
  login,
  getAllStudents,
} = require("../controllers/authController");

// 🔐 Middlewares (✅ updated path)
const {
  verifyToken,
  isAdmin,
} = require("../middlewares/authMiddleware"); // unchanged because still correct

// ============================
// ✅ Public Routes
// ============================

// 🔓 Login
router.post("/login", login);

// 🧾 Register (general use)
router.post("/register", register);

// ============================
// 🔐 Admin Protected Routes
// ============================

// 🧑‍🎓 Register a student (Admin only)
router.post("/register-student", verifyToken, isAdmin, register);

// 📋 Get all students (Admin only)
router.get("/students", verifyToken, isAdmin, getAllStudents);

// ============================
// ✅ Export Routes
// ============================
module.exports = router;
