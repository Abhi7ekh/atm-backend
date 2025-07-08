// controllers/studentController.js

const connectDB = require("../utils/db");
const { USERS_DB } = require("../constants/dbNames");

// ===================================================
// 📘 GET All Registered Students (Admin Only)
// ===================================================
exports.getAllStudents = async (req, res) => {
  try {
    const { cloudantClient } = await connectDB();

    const result = await cloudantClient.postFind({
      db: USERS_DB,
      selector: { role: "student" },
    });

    return res.status(200).json({
      success: true,
      students: result.result.docs,
    });
  } catch (err) {
    console.error("❌ Fetch Students Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching students",
    });
  }
};
