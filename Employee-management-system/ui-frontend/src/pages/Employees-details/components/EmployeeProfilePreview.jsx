import React from "react";

const EmployeeProfilePreview = ({ employee }) => {
  if (!employee) {
    return (
      <div className="profile-preview">
        <h3>Select Employee</h3>
      </div>
    );
  }

  return (
    <div className="profile-preview">

      <h2>{employee.name}</h2>

      <p>
        <strong>Email:</strong> {employee.email}
      </p>

      <p>
        <strong>Department:</strong> {employee.department}
      </p>

      <p>
        <strong>Designation:</strong> {employee.designation}
      </p>

      <p>
        <strong>Attendance:</strong> {employee.attendance}
      </p>

      <p>
        <strong>Status:</strong> {employee.status}
      </p>

    </div>
  );
};

export default EmployeeProfilePreview;