// routes/taskRoutes.js

const express = require("express");
const router = express.Router();

// ✅ Middlewares
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Controllers
const {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/taskController");

// ==============================
// 🔐 Protected Task Routes
// ==============================

// ➕ Create Task (Admin Only)
router.post("/", verifyToken, isAdmin, createTask);

// 🧑‍💼 Get All Tasks (Admin Only)
router.get("/all", verifyToken, isAdmin, getAllTasks);

// ✏️ Update Task (Admin Only)
router.put("/:id", verifyToken, isAdmin, updateTask);

// ❌ Delete Task (Admin Only)
router.delete("/:id", verifyToken, isAdmin, deleteTask);

// 🎓 Get Tasks for Logged-in Student
router.get("/my", verifyToken, getMyTasks);

// 🧩 Update Task Status (Student)
router.put("/status/:id", verifyToken, updateTaskStatus);

// ==============================
// ✅ Export Routes
// ==============================
module.exports = router;
