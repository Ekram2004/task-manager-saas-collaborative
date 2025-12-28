    import React, { useState, useEffect } from 'react';
    import api from '../api';
    import { useAuth } from '../context/AuthContext';

    const TaskEditModal = ({ task, isOpen, onClose, onTaskUpdated }) => {
      const { user } = useAuth();
      const [title, setTitle] = useState(task.title);
      const [description, setDescription] = useState(task.description || "");
      const [status, setStatus] = useState(task.status);
      const [priority, setPriority] = useState(task.priority);
      const [dueDate, setDueDate] = useState(
        task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
      );
      const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || "");
      const [members, setMembers] = useState([]);
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(false);
      const [fetchingMembers, setFetchingMembers] = useState(true); // New state for loading members

      // Update local state when 'task' prop changes
      useEffect(() => {
        if (task) {
          setTitle(task.title);
          setDescription(task.description || "");
          setStatus(task.status);
          setPriority(task.priority);
          setDueDate(
            task.dueDate
              ? new Date(task.dueDate).toISOString().split("T")[0]
              : ""
          );
          setAssignedTo(task.assignedTo?._id || "");
        }
      }, [task]);

      // Fetch organization members to populate assignedTo dropdown
      useEffect(() => {
        const fetchMembers = async () => {
          if (!user?.organization || !isOpen) {
            // Only fetch if user has org and modal is open
            setFetchingMembers(false);
            return;
          }
          setFetchingMembers(true);
          try {
            const response = await api.get("/api/organizations/my/members");
            setMembers(response.data.data);
          } catch (error) {
            console.error("Error fetching organization members:", error);
            // Optionally set an error message for members fetching
          } finally {
            setFetchingMembers(false);
          }
        };
        fetchMembers();
      }, [user, isOpen]); // Refetch when user context or modal open state changes

      const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
          const updatedTask = {
            title,
            description,
            status,
            priority,
            dueDate: dueDate || undefined,
            assignedTo: assignedTo === "" ? null : assignedTo, // Send null if unassigned
          };

          const response = await api.put(`/api/tasks/${task._id}`, updatedTask);
          setMessage("Task updated successfully!");
          onTaskUpdated(response.data.data); // Notify parent component to update task list
          setTimeout(onClose, 1500); // Close modal after a short delay
        } catch (error) {
          console.error(
            "Error updating task:",
            error.response?.data?.message || error.message
          );
          setMessage(error.response?.data?.message || "Failed to update task.");
        } finally {
          setLoading(false);
        }
      };

      if (!isOpen) return null;

      return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 bg-white w-full max-w-lg mx-auto rounded-lg shadow-xl animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Edit Task
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title, Description, Status, Priority, Due Date - no changes here */}
              <div>
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={loading || fetchingMembers}
                />
              </div>
              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={loading || fetchingMembers}
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="edit-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500UnlimAI (GPT | Claude | MidJourney), [12/28/2025 5:09 AM]
sm:text-sm"
                    disabled={loading || fetchingMembers}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                    <option>Archived</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="edit-priority"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Priority
                  </label>
                  <select
                    id="edit-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={loading || fetchingMembers}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="edit-dueDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  id="edit-dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={loading || fetchingMembers}
                />
              </div>
              {/* Assigned To dropdown - NOW POPULATED */}
              <div>
                <label
                  htmlFor="edit-assignedTo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Assigned To (Optional)
                </label>
                <select
                  id="edit-assignedTo"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={loading || fetchingMembers}
                >
                  <option value="">Unassigned</option>
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

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex jus

UnlimAI (GPT | Claude | MidJourney), [12/28/2025 5:09 AM]
tify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading || fetchingMembers}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || fetchingMembers}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };

    export default TaskEditModal;
