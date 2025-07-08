// server.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const studentRoutes = require("./routes/studentRoutes");

// ✅ Load env variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/students", studentRoutes);

// ✅ Root Test Route
app.get("/", (req, res) => {
  res.send("🌍 IBM Cloudant Task Manager Backend Running");
});

// ✅ Render sets process.env.PORT automatically
const PORT = process.env.PORT || 5000;

// ✅ Start the Server
const startServer = async () => {
  try {
    console.log("🔄 Connecting to IBM Cloudant...");
    await connectDB();
    console.log("✅ Connected to IBM Cloudant");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Cloudant connection error:", err.message);
    process.exit(1);
  }
};

// ✅ Start App
startServer();

// ✅ Global Handlers
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  process.exit(1);
});
