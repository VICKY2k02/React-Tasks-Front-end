import "./styles.css";

import { useEffect, useState } from "react";

import { getEmployees }from "../services/EmployeeService";

import DashboardStats from "./DashboardCompopnents/DashboardStats";

import DepartmentChart from "./DashboardCompopnents/Departmentchart";

import AttendanceChart from "./DashboardCompopnents/AttendanceChart";

import ActivityChart from "./DashboardCompopnents/ActivityChart";

function Dashboard() {

  const [employees,
    setEmployees] = useState([]);

  useEffect(() => {

    loadEmployees();

  }, []);

  const loadEmployees =
    async () => {

      const data =
        await getEmployees();

      setEmployees(data);

    };

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
        employees={employees}
      />

      <div
        className="dashboard-content"
      >

        <DepartmentChart
          employees={employees}
        />

        <AttendanceChart
          employees={employees}
        />

      </div>

      <ActivityChart
        employees={employees}
      />

    </div>
  );
}

export default Dashboard;