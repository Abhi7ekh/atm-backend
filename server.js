const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const studentRoutes = require("./routes/studentRoutes");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/students", studentRoutes);

// ✅ Root
app.get("/", (req, res) => {
  res.send("🌍 IBM Cloudant Task Manager Backend Running");
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to IBM Cloudant:", err.message);
    process.exit(1); // Exit process on fatal error
  });

// ✅ Global Error Handler for Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

// ✅ Global Error Handler for Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  process.exit(1);
});
