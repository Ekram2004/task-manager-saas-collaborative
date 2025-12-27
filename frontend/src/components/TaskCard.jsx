import React from "react";
import { format } from "date-fns";

const TaskCard = ({ task }) => {
  // Tailwind classes for status badges
  const statusColors = {
    "To Do": "bg-gray-200 text-gray-800",
    "In Progress": "bg-blue-200 text-blue-800",
    Done: "bg-green-200 text-green-800",
    Archived: "bg-red-200 text-red-800",
  };

  const priorityColors = {
    Low: "text-green-600",
    Medium: "text-yellow-600",
    High: "text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight pr-4">
            {task.title}
          </h3>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              statusColors[task.status] || "bg-gray-200 text-gray-800"
            }`}
          >
            {task.status}
          </span>
        </div>
        {task.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {task.description}
          </p>
        )}
      </div>

      <div className="text-sm text-gray-500 mt-4 space-y-1">
        {task.priority && (
          <p>
            Priority:{" "}
            <span className={`font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </p>
        )}
        {task.dueDate && (
          <p>
            Due Date:{" "}
            <span className="font-medium">
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </span>
          </p>
        )}
        {task.assignedTo && (
          <p>
            Assigned to:{" "}
            <span className="font-medium">{task.assignedTo.name}</span>
          </p>
        )}
        <p>
          Created by: <span className="font-medium">{task.createdBy.name}</span>{" "}
          on {format(new Date(task.createdAt), "MMM d, yyyy")}
        </p>
      </div>
      {/* Future: Edit/Delete buttons can go here */}
    </div>
  );
};

export default TaskCard;
