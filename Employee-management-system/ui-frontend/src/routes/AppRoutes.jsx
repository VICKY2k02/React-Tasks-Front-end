import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import  {AuthContext}  from "../context/AuthContext";

import Login from "../pages/Login";
import Signup from "../pages/Singup";
import Dashboard from "../pages/Dashboard";
import EmployeeDashboard from "../pages/Employees-details/Employees";
import Departments from "../pages/Department";
import Attendance from "../pages/Attendance";
import Settings from "../pages/Settings";
import ForgotPassword from "../pages/ForgotPassword";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";

const AppRoutes = () => {
  const auth = useContext(AuthContext);

  // Prevent crash if provider is missing
  const user = auth?.user;

  return (
  <Routes>

    {/* Public Routes */}

    <Route
      path="/"
      element={<Login />}
    />

    <Route
      path="/forgot-password"
      element={<ForgotPassword />}
    />

    <Route
    path="/signup"
    element={<Signup />}
  />

    {/* Protected Layout */}

    <Route
      element={
        <ProtectedRoute user={user}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/employees"
        element={<EmployeeDashboard />}
      />

      <Route
        path="/departments"
        element={
          <ProtectedRoute
            user={user}
            role="admin"
          >
            <Departments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute
            user={user}
            role="admin"
          >
            <Attendance />
          </ProtectedRoute>
        }
      />



          <Route
            path="/settings"
            element={
              <ProtectedRoute
                user={user}
                // role="user"
              >
                <Settings />
              </ProtectedRoute>
            }
          />

    </Route>

  </Routes>
  );
  };

  export default AppRoutes;