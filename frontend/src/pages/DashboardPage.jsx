import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // Import Navbar

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Navbar /> Render the Navbar */}
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          Dashboard
        </h2>

        {user && user.organization ? (
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
            {/* In the future, we'll display organization name here */}
            <p className="text-gray-600 mt-2">Ready to manage your tasks!</p>
            {/* Further organization details and task lists will go here */}
          </div>
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
                  It looks like you haven't joined or created an organization
                  yet.
                </p>
                <Link
                  to="/organizations/create"
                  className="font-medium text-yellow-700 hover:text-yellow-900 underline mt-2 inline-block"
                >
                  Click here to create your first organization to start managing
                  tasks!
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for task list or other dashboard components */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Your Tasks
          </h3>
          <p className="text-gray-600">
            Task list will appear here once you have an organization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
