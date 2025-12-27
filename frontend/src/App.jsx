import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import OrganizationCreatePage from "./pages/OrganizationCreatePage"; // Import new page
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/organizations/create"
            element={<OrganizationCreatePage />}
          />{" "}
          {/* New protected route */}
          {/* Add more protected routes here as we build them */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />{" "}
          {/* Redirect root to dashboard */}
        </Route>

        {/* Catch-all for undefined routes - redirect to dashboard if authenticated, else to login */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
