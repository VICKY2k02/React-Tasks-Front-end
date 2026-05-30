import React from "react";

const DashboardStats = ({ employees }) => {

  // SAFE FALLBACK
  const employeeList = employees || [];

  const activeEmployees = employeeList.filter(
    (emp) => emp.status === "Active"
  ).length;

    const inactiveEmployees = employeeList.filter(
    (emp) => emp.status === "Inactive"
  ).length;
     
   const onLeaveEmployees = employeeList.filter(
    (emp) => emp.status === "On Leave"
  ).length;

  const departments = [
    ...new Set(employeeList.map(emp => emp.department))
  ];

  return (
    <div className="stats-container">

      <div className="stats-card">
        <h3>Total Employees</h3>
        <p>{employeeList.length}</p>
      </div>

      <div className="stats-card">
        <h3>Active Employees</h3>
        <p>{activeEmployees}</p>
      </div>

      <div className="stats-card">
        <h3>In Active Employees</h3>
        <p>{inactiveEmployees}</p>
      </div>

      <div className="stats-card">
        <h3>On Leave</h3>
        <p>{onLeaveEmployees}</p>
      </div>

      <div className="stats-card">
        <h3>Departments</h3>
        <p>{departments.length}</p>
      </div>

    </div>
  );
};

export default DashboardStats;