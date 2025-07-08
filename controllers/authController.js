// controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const connectDB = require("../utils/db");
const { USERS_DB } = require("../constants/dbNames");
require("dotenv").config();

// ==================================
// ✅ Register Controller
// ==================================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "All fields are required ❌",
      });
    }

    const { cloudantClient } = await connectDB();

    const existingUser = await cloudantClient.postFind({
      db: USERS_DB, // ✅ FIXED
      selector: { email },
    });

    if (existingUser.result.docs.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Email already registered ⚠️",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword, role };

    const response = await cloudantClient.postDocument({
      db: USERS_DB, // ✅ FIXED
      document: newUser,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully ✅",
      userId: response.result.id,
    });
  } catch (error) {
    console.error("❌ Register Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Server error during registration",
    });
  }
};

// ==================================
// ✅ Login Controller
// ==================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password required ❌",
      });
    }

    const { cloudantClient } = await connectDB();

    const userResult = await cloudantClient.postFind({
      db: USERS_DB, // ✅ FIXED
      selector: { email },
    });

    const user = userResult.result.docs[0];
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials ❌",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials ❌",
      });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful ✅",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Server error during login",
    });
  }
};

// ==================================
// ✅ Get All Students (Admin)
// ==================================
exports.getAllStudents = async (req, res) => {
  try {
    const { cloudantClient } = await connectDB();

    const result = await cloudantClient.postFind({
      db: USERS_DB, // ✅ FIXED
      selector: { role: "student" },
      fields: ["_id", "name", "email"],
    });

    const students = result.result.docs.map(({ _id, name, email }) => ({
      id: _id,
      name,
      email,
    }));

    return res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("❌ Error fetching students:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch students",
    });
  }
};
