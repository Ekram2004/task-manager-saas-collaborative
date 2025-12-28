    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';
    import api from '../api'; // Our axios instance
    import Navbar from '../components/Navbar';

    const OrganizationCreatePage = () => {
      const [name, setName] = useState("");
      const [message, setMessage] = useState("");
      const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
      const { user, setUser } = useAuth(); // We need setUser to update the context

      // Redirect if user already has an organization
      if (user && user.organization) {
        navigate("/dashboard");
        return null; // Don't render anything if redirecting
      }

      const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
          const response = await api.post("/api/organizations", { name });
          const { organization, user: updatedUser } = response.data;

          // Update AuthContext and local storage with the new user data (which includes organization ID)
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));

          setMessage("Organization created successfully!");
          navigate("/dashboard"); // Redirect to dashboard
        } catch (error) {
          console.error(
            "Error creating organization:",
            error.response?.data || error.message
          );
          setMessage(
            error.response?.data?.message || "Failed to create organization."
          );
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto p-6">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-xl mt-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                Create Your Organization
              </h2>
              <p className="text-gray-600 text-center mb-8">
                This is where your team will manage tasks. Choose a unique name!
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="organization-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Organization Name
                  </label>
                  <input
                    id="organization-name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., My Awesome Team"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
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
                    {loading ? "Creating..." : "Create Organization"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    };

    export default OrganizationCreatePage;
