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

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("🌍 IBM Cloudant Task Manager Backend Running");
});

const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    console.log("🔄 Attempting to connect to Cloudant...");
    await connectDB();
    console.log("✅ Cloudant: Connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server live on Render: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Cloudant Connection Failed:", err.message);
    process.exit(1);
  }
};

startServer();

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  process.exit(1);
});
