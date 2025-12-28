import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-2xl font-bold">
          TaskFlow SaaS
        </Link>
        <div className="flex items-center space-x-4">
          {user &&
            user.organization && ( // Only show if user has an organization
              <Link
                to="/organizations/members" // New link
                className="text-white hover:text-indigo-200 transition duration-150 ease-in-out text-lg hidden md:block"
              >
                Members
              </Link>
            )}
          {user && user.name && (
            <span className="text-white text-lg hidden sm:block">
              Welcome, {user.name.split(" ")[0]}!
            </span>
          )}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
