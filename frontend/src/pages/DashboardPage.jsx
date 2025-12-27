import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          borderBottom: "1px solid #eee",
          paddingBottom: "15px",
        }}
      >
        <h2>Welcome, {user?.name || "User"}!</h2>
        <button
          onClick={logout}
          style={{
            padding: "8px 15px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <p>This is your dashboard. More content will go here.</p>

      {/* Placeholder for future features */}
      {user && !user.organization && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px dashed #007bff",
            borderRadius: "8px",
            backgroundColor: "#e9f5ff",
          }}
        >
          <p>
            It looks like you haven't joined or created an organization yet.
          </p>
          <Link
            to="/organizations/create"
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontWeight: "bold",
            }}
          >
            Create your first organization to start managing tasks!
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
