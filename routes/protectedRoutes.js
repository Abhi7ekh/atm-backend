// routes/protectedRoutes.js

const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/authMiddleware");
const connectDB = require("../utils/db");

// 🔒 Test protected route
router.get("/", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: `Hello, ${req.user.email}! You have accessed a protected route.`,
  });
});

// ✅ Admin: Get All Students
router.get("/get-students", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const { cloudantClient, usersDb } = await connectDB();
    const response = await cloudantClient.postFind({
      db: usersDb,
      selector: { role: "student" },
      fields: ["_id", "name", "email", "role"],
    });

    res.json({ success: true, students: response.result.docs });
  } catch (err) {
    console.error("❌ Error fetching students:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch students" });
  }
});

module.exports = router;
