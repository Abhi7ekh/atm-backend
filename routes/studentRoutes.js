// routes/studentRoutes.js

const express = require("express");
const router = express.Router();

// 🔐 Middleware
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// 📘 Controller
const { getAllStudents } = require("../controllers/studentController");

// ===================================================
// 📘 GET All Registered Students (Admin Only)
// ===================================================
router.get("/", verifyToken, isAdmin, getAllStudents);

module.exports = router;
