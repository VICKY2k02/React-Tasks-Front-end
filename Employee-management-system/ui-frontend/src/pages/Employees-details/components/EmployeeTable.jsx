import React from "react";

import {FaEdit, FaTrash} from "react-icons/fa";

const EmployeeTable = ({ employees, 
                          setSelectedEmployee, 
                          handleDeleteEmployee, 
                          // handleStatusToggle,
                          handleStatusChange,
                          handleEdit }) => {

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

              <select
                className={`status-select ${
                  employee.status === "Active"
                    ? "status-active"
                    : employee.status === "Inactive"
                    ? "status-inactive"
                    : "status-leave"
                }`}
                value={employee.status}
                onChange={(e) =>
                  handleStatusChange(
                    employee.id,
                    e.target.value
                  )
                }
              >

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

              <option value="On Leave">
                On Leave
              </option>

              </select>

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