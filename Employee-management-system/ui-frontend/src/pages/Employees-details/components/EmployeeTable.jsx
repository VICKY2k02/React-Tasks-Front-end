import React from "react";

import {FaEdit, FaTrash} from "react-icons/fa";

const EmployeeTable = ({ employees, setSelectedEmployee, handleDeleteEmployee, handleStatusToggle, handleEdit }) => {

  return (
    <table className="employee-table">

      <thead>
        <tr>
          <th>Name</th>
          <th>Department</th>
          <th>Designation</th>
          <th>Attendance</th>
          <th>Status</th>
          <th>Actions</th>
          <th>Edit</th>
        </tr>
      </thead>

      <tbody>

        {employees.map((employee) => (

          <tr
            key={employee.id}
            onClick={() => setSelectedEmployee(employee)}
          >

            <td>{employee.name}</td>

            <td>{employee.department}</td>

            <td>{employee.designation}</td>

            <td>{employee.attendance}</td>

 

            <td>
                <button
                  className={
                    employee.status === "Active"
                      ? "active-btn"
                      : "inactive-btn"
                  }
                  onClick={() =>
                    handleStatusToggle(employee)
                  }
                >
                  {employee.status}
                </button>
          </td>


          <td>
                <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteEmployee(employee.id)
                    }
                  >
                    <FaTrash />
                </button>
          </td>

          <td>
                <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(employee)
                    }
                  >
                    <FaEdit />
                </button>
          </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
};

export default EmployeeTable;