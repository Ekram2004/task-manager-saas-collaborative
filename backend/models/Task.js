const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a task title"],
    trim: true,
    maxlength: [100, "Title can not be more than 100 characters"],
  },
  description: {
    type: String,
    maxlength: [500, "Description can not be more than 500 characters"],
  },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done", "Archived"], // Example statuses
    default: "To Do",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  dueDate: {
    type: Date,
  },
  organization: {
    // Task must belong to an organization
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  assignedTo: {
    // User assigned to this task
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // Task might not be assigned initially
  },
  createdBy: {
    // User who created the task
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update 'updatedAt' timestamp on save
TaskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Task", TaskSchema);
