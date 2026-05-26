import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import EmployeeDashboard from "../pages/Employees-details/Employees";
import Departments from "../pages/Department";
import Attendance from "../pages/Attendance";
import Settings from "../pages/Settings";


import DashboardLayout from "../components/DashboardLayout";

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeDashboard/>} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/attendance" element={<Attendance/>} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
  );
};

export default AppRoutes;