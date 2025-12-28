import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const TaskForm = ({ onTaskCreated }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingMembers, setFetchingMembers] = useState(true);

  /* -------------------- Fetch Organization Members -------------------- */
  useEffect(() => {
    const fetchMembers = async () => {
      if (!user?.organization) {
        setMembers([]);
        setFetchingMembers(false);
        return;
      }

      setFetchingMembers(true);
      try {
        // Backend returns the organization directly
        const res = await api.get("/api/organizations/my");

        const orgMembers = res.data.members || [];
        setMembers(orgMembers);

        // Default assignedTo → current user if present
        if (orgMembers.some((m) => m._id === user.id)) {
          setAssignedTo(user.id);
        } else {
          setAssignedTo("");
        }
      } catch (err) {
        console.error("Error fetching members:", err);
        setMessage("Failed to load organization members.");
      } finally {
        setFetchingMembers(false);
      }
    };

    fetchMembers();
  }, [user]);

  /* -------------------- Submit Task -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload = {
        title,
        description,
        status,
        priority,
        dueDate: dueDate || undefined,
        assignedTo: assignedTo || undefined,
      };

      const res = await api.post("/api/tasks", payload);

      setMessage("Task created successfully!");
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setPriority("Medium");
      setDueDate("");

      // Reset assignedTo
      if (members.some((m) => m._id === user.id)) {
        setAssignedTo(user.id);
      } else {
        setAssignedTo("");
      }

      if (onTaskCreated) {
        onTaskCreated(res.data);
      }
    } catch (err) {
      console.error("Create task error:", err);
      setMessage(err.response?.data?.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Create New Task
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading || fetchingMembers}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description (Optional)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading || fetchingMembers}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Status / Priority / Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading || fetchingMembers}
              className="mt-1 w-full border rounded-md px-3 py-2"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
              <option>Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading || fetchingMembers}
              className="mt-1 w-full border rounded-md px-3 py-2"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading || fetchingMembers}
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assigned To (Optional)
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            disabled={loading || fetchingMembers}
            className="mt-1 w-full border rounded-md px-3 py-2"
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-sm text-center ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || fetchingMembers}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
