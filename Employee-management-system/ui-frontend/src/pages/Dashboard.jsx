import "./styles.css";

import { useEffect, useState } from "react";

import { getEmployees, getDashboardStats }from "../services/EmployeeService";

import DashboardStats from "./DashboardCompopnents/DashboardStats";

import DepartmentChart from "./DashboardCompopnents/Departmentchart";

import AttendanceChart from "./DashboardCompopnents/AttendanceChart";

import ActivityChart from "./DashboardCompopnents/ActivityChart";

import RoleChart from "./DashboardCompopnents/RoleChart";

function Dashboard() {
  // const [stats, setStats] = useState({});
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
  totalEmployees: 0,
  activeEmployees: 0,
  departments: 0,
  pendingRequests: 0
});


 const loadDashboardData = async () => {

  const employeeData =
    await getEmployees();

  setEmployees(employeeData);

  const statsData =
    await getDashboardStats();

  setStats(statsData);

};

useEffect(() => {

  const refreshDashboard = () => {
    loadDashboardData();
  };

  loadDashboardData();

  window.addEventListener(
    "dashboardRefresh",
    refreshDashboard
  );

  return () => {

    window.removeEventListener(
      "dashboardRefresh",
      refreshDashboard
    );

  };

}, []);
  return (

    <div className="dashboard-wrapper">

      <div className="dashboard-header">

        <div>

          <h1>
            Employee Analytics Dashboard
          </h1>

          <p>
            Real-time employee insights
          </p>

        </div>

      </div>

      <DashboardStats
        // employees={employees}
        stats={stats}
      />

      <div
        className="dashboard-content"
      >
        <AttendanceChart
          employees={employees}
        />
        <DepartmentChart
          employees={employees}
        />



      </div>

      <div  className="dashboard-content">
        
      <ActivityChart
        employees={employees}
      />

      <RoleChart
        employees={employees}
      />
      </div>


    </div>
  );
}

export default Dashboard;