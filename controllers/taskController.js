const connectDB = require("../utils/db");
const { TASKS_DB } = require("../constants/dbNames");

// =====================================================
// 🆕 CREATE TASK (Supports Multiple Students)
// =====================================================
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    if (!title || !description || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required ❌",
      });
    }

    if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one student must be assigned ❌",
      });
    }

    const { cloudantClient } = await connectDB();

    const task = {
      title,
      description,
      assignedTo,
      dueDate,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const response = await cloudantClient.postDocument({
      db: TASKS_DB,
      document: task,
    });

    return res.status(201).json({
      success: true,
      message: "✅ Task created successfully",
      taskId: response.result.id,
    });
  } catch (err) {
    console.error("❌ Create Task Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error during task creation",
    });
  }
};

// =====================================================
// 🧾 GET ALL TASKS (Admin)
// =====================================================
exports.getAllTasks = async (req, res) => {
  try {
    const { cloudantClient } = await connectDB();

    const response = await cloudantClient.postFind({
      db: TASKS_DB,
      selector: {},
    });

    return res.status(200).json({
      success: true,
      tasks: response.result.docs,
    });
  } catch (err) {
    console.error("❌ Get All Tasks Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error during task fetch",
    });
  }
};

// =====================================================
// 🎓 GET TASKS FOR LOGGED-IN STUDENT
// =====================================================
exports.getMyTasks = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { cloudantClient } = await connectDB();

    const response = await cloudantClient.postFind({
      db: TASKS_DB,
      selector: {
        assignedTo: { "$elemMatch": { "$eq": studentId } },
      },
    });

    return res.status(200).json({
      success: true,
      tasks: response.result.docs,
    });
  } catch (err) {
    console.error("❌ Get My Tasks Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching your tasks",
    });
  }
};

// =====================================================
// ✏️ UPDATE TASK (Admin)
// =====================================================
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, assignedTo } = req.body;

    const { cloudantClient } = await connectDB();

    const existing = await cloudantClient.getDocument({ db: TASKS_DB, docId: id });

    const updatedTask = {
      ...existing.result,
      title,
      description,
      dueDate,
      assignedTo,
    };

    const response = await cloudantClient.putDocument({
      db: TASKS_DB,
      docId: id,
      document: updatedTask,
    });

    return res.status(200).json({
      success: true,
      message: "✅ Task updated successfully",
    });
  } catch (err) {
    console.error("❌ Update Task Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating task",
    });
  }
};

// =====================================================
// ❌ DELETE TASK (Admin)
// =====================================================
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { cloudantClient } = await connectDB();

    const taskDoc = await cloudantClient.getDocument({ db: TASKS_DB, docId: id });

    await cloudantClient.deleteDocument({
      db: TASKS_DB,
      docId: id,
      rev: taskDoc.result._rev,
    });

    return res.status(200).json({
      success: true,
      message: "🗑️ Task deleted successfully",
    });
  } catch (err) {
    console.error("❌ Delete Task Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting task",
    });
  }
};

// =====================================================
// 🧩 UPDATE TASK STATUS (Student)
// =====================================================
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { cloudantClient } = await connectDB();

    const existingTask = await cloudantClient.getDocument({ db: TASKS_DB, docId: id });

    existingTask.result.status = status;

    await cloudantClient.putDocument({
      db: TASKS_DB,
      docId: id,
      document: existingTask.result,
    });

    return res.status(200).json({
      success: true,
      message: "✅ Task status updated",
    });
  } catch (err) {
    console.error("❌ Status Update Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error during status update",
    });
  }
};
