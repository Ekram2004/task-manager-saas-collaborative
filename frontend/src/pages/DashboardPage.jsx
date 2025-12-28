    import React, { useState, useEffect } from 'react';
    import { useAuth } from '../context/AuthContext';
    import { Link } from 'react-router-dom';
    import Navbar from '../components/Navbar';
    import TaskCard from '../components/TaskCard';
    import TaskForm from '../components/TaskForm';
    import TaskEditModal from '../components/TaskEditModal'; // Import TaskEditModal
    import api from '../api';

    const DashboardPage = () => {
      const { user } = useAuth();
      const [tasks, setTasks] = useState([]);
      const [loadingTasks, setLoadingTasks] = useState(true);
      const [error, setError] = useState("");

      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [taskToEdit, setTaskToEdit] = useState(null);

      const fetchTasks = async () => {
        if (!user?.organization) {
          setLoadingTasks(false);
          return;
        }
        setLoadingTasks(true);
        setError("");
        try {
          const response = await api.get("/api/tasks");
          setTasks(response.data.data);
        } catch (err) {
          console.error("Error fetching tasks:", err);
          setError("Failed to load tasks. Please try again.");
        } finally {
          setLoadingTasks(false);
        }
      };

      useEffect(() => {
        fetchTasks();
      }, [user?.organization]);

      const handleTaskCreated = (newTask) => {
        setTasks((prevTasks) => [newTask, ...prevTasks]);
      };

      const handleEditClick = (task) => {
        setTaskToEdit(task);
        setIsEditModalOpen(true);
      };

      const handleTaskUpdated = (updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        );
        setIsEditModalOpen(false); // Close modal after update
        setTaskToEdit(null); // Clear task to edit
      };

      const handleDeleteClick = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
          try {
            await api.delete(`/api/tasks/${taskId}`);
            setTasks((prevTasks) =>
              prevTasks.filter((task) => task._id !== taskId)
            );
          } catch (err) {
            console.error("Error deleting task:", err);
            setError("Failed to delete task. Please try again.");
          }
        }
      };

      return (
        <div className="min-h-screen bg-gray-100">
          <Navbar />

          <div className="container mx-auto p-6">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
              Dashboard
            </h2>

            {user && user.organization ? (
              <>
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Your Organization
                  </h3>
                  <p className="text-gray-700">
                    Organization ID:{" "}
                    <span className="font-mono bg-gray-100 p-1 rounded text-sm">
                      {user.organization}
                    </span>
                  </p>
                  <p className="text-gray-600 mt-2">
                    Ready to manage your tasks!
                  </p>
                </div>

                <TaskForm onTaskCreated={handleTaskCreated} />

                <div className="mt-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Your Tasks
                  </h3>
                  {loadingTasks ? (
                    <p className="text-gray-600">Loading tasks...</p>
                  ) : error ? (
                    <p className="text-red-600">{error}</p>
                  ) : tasks.length === 0 ? (
                    <p className="text-gray-600">
                      No tasks found. Create one above!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div
                className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg shadow-md"
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-yellow-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">Action Required!</p>
                    <p className="text-sm">
                      It looks like you haven't joined or created an
                      organization yet.
                    </p>
                    <Link
                      to="/organizations/create"
                      className="font-medium text-yellow-700 hover:text-yellow-900 underline mt-2 inline-block"
                    >
                      Click here to create your first organization to start
                      managing tasks!
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {taskToEdit && (
            <TaskEditModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              task={taskToEdit}
              onTaskUpdated={handleTaskUpdated}
            />
          )}
        </div>
      );
    };

    export default DashboardPage;
