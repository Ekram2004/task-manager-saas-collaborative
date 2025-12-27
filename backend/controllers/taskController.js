const Task = require("../models/Task");
const Organization = require("../models/Organization"); // To validate organization

// @desc    Get all tasks for the user's organization
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const organizationId = req.organizationId; // From auth middleware

    if (!organizationId) {
      return res
        .status(400)
        .json({ message: "User is not associated with an organization." });
    }

    const tasks = await Task.find({ organization: organizationId })
      .populate("assignedTo", "name email") // Populate assigned user info
      .populate("createdBy", "name email") // Populate creator user info
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const organizationId = req.organizationId; // From auth middleware
    const task = await Task.findOne({
      _id: req.params.id,
      organization: organizationId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Task not found or you do not have access.",
        });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo } =
    req.body;
  const organizationId = req.organizationId;
  const createdBy = req.user.id;

  if (!organizationId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "User is not associated with an organization.",
      });
  }

  try {
    // Optional: Validate if assignedTo user is part of the same organization
    if (assignedTo) {
      const organization = await Organization.findById(organizationId);
      if (!organization || !organization.members.includes(assignedTo)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Assigned user is not a member of this organization.",
          });
      }
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      organization: organizationId,
      createdBy,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(400)
      .json({
        success: false,
        message: error.message || "Failed to create task",
      });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo } =
    req.body;
  const organizationId = req.organizationId;

  if (!organizationId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "User is not associated with an organization.",
      });
  }

  try {
    let task = await Task.findOne({
      _id: req.params.id,
      organization: organizationId,
    });

    if (!task) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Task not found or you do not have access.",
        });
    }

    // Optional: Validate if assignedTo user is part of the same organization
    if (assignedTo && assignedTo.toString() !== task.assignedTo?.toString()) {
      // Only check if assignedTo is changing
      const organization = await Organization.findById(organizationId);
      if (!organization || !organization.members.includes(assignedTo)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Assigned user is not a member of this organization.",
          });
      }
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo; // Allow setting to null if assignedTo is explicitly null

    // Handle explicitly unassigning a task (if assignedTo is sent as null)
    if (req.body.hasOwnProperty("assignedTo") && assignedTo === null) {
      task.assignedTo = null;
    }

    await task.save();

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error("Error updating task:", error);
    res
      .status(400)
      .json({
        success: false,
        message: error.message || "Failed to update task",
      });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  const organizationId = req.organizationId;

  if (!organizationId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "User is not associated with an organization.",
      });
  }

  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      organization: organizationId,
    });

    if (!task) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Task not found or you do not have access.",
        });
    }

    res.status(200).json({ success: true, message: "Task removed" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
