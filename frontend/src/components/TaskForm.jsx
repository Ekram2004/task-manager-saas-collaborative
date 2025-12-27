    import React, { useState, useEffect } from 'react';
    import api from '../api';
    import { useAuth } from '../context/AuthContext'; // To get current user info

    const TaskForm = ({ onTaskCreated }) => {
      const { user } = useAuth();
      const [title, setTitle] = useState("");
      const [description, setDescription] = useState("");
      const [status, setStatus] = useState("To Do");
      const [priority, setPriority] = useState("Medium");
      const [dueDate, setDueDate] = useState("");
      const [assignedTo, setAssignedTo] = useState(""); // Will be user ID
      const [members, setMembers] = useState([]); // To populate assignedTo dropdown
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(false);

      // Fetch organization members to populate assignedTo dropdown
      useEffect(() => {
        const fetchMembers = async () => {
          if (user?.organization) {
            try {
              // For simplicity, we'll fetch members from the organization endpoint.
              // In a real app, you might have a dedicated /api/organizations/:id/members endpoint.
              const response = await api.get(`/api/organizations/my`);
              const org = response.data.organization;
              // Assuming the 'members' array in organization model contains user IDs
              // We need actual user details, so this would require a separate endpoint
              // to fetch user details for each member ID.
              // For now, we'll just add the current user as an option.
              setMembers([{ _id: user.id, name: user.name }]);
              setAssignedTo(user.id); // Assign to self by default
            } catch (error) {
              console.error("Error fetching organization members:", error);
            }
          }
        };
        fetchMembers();
      }, [user]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
          const newTask = {
            title,
            description,
            status,
            priority,
            dueDate: dueDate || undefined, // Send as undefined if empty
            assignedTo: assignedTo || undefined, // Send as undefined if empty
          };

          const response = await api.post("/api/tasks", newTask);
          setMessage("Task created successfully!");
          setTitle("");
          setDescription("");
          setStatus("To Do");
          setPriority("Medium");
          setDueDate("");
          setAssignedTo(user.id); // Reset assigned to current user
          if (onTaskCreated) {
            onTaskCreated(response.data.data); // Notify parent component to refresh task list
          }
        } catch (error) {
          console.error(
            "Error creating task:",
            error.response?.data?.message || error.message
          );
          setMessage(error.response?.data?.message || "Failed to create task.");
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Create New Task
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={loading}
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={loading}
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Done</option>
                  <option>Archived</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={loading}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="assignedTo"
                className="block text-sm font-medium text-gray-700"
              >
                Assigned To (Optional)
              </label>
              <select
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={loading}
              >
                <option value="">Unassigned</option>
                {/* Populate with actual members later */}
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {message && (
              <div
                className={`text-sm text-center ${
                  message.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Creating..." : "Add Task"}
              </button>
            </div>
          </form>
        </div>
      );
    };

    export default TaskForm;
