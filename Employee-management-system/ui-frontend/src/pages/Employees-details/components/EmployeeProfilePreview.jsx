import React from "react";

const EmployeeProfilePreview = ({ employee }) => {

  if (!employee) {

    return (
      <div className="profile-card">
        <h3>Select Employee</h3>
        <p>
          Click employee row to view details.
        </p>
      </div>
    );
  }

  return (

    <div className="profile-card">

      <div className="profile-top">

        <div className="profile-avatar">
          {employee.name.charAt(0)}
        </div>

        <div className="emp">

          <h2>{employee.name}</h2>

          <span>
            {employee.designation}
          </span>

        </div>

      </div>

      <div className="profile-details">

        <div>
          <strong>Email</strong>
          <p>{employee.email}</p>
        </div>

        <div>
          <strong>Department</strong>
          <p>{employee.department}</p>
        </div>

        <div>
          <strong>Attendance</strong>
          <p>{employee.attendance}</p>
        </div>

        <div>
          <strong>Status</strong>
          <p>{employee.status}</p>
        </div>

      </div>

    </div>

  );
};

export default EmployeeProfilePreview;