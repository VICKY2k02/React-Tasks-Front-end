import { useState } from "react";

import {FaEdit, FaTrash, FaEllipsisV} from "react-icons/fa";

const EmployeeTable = ({ employees, 
                          setSelectedEmployee, 
                          handleDeleteEmployee, 
                          // handleStatusToggle,
                          handleStatusChange,
                          handleEdit }) => {

const [openMenu, setOpenMenu] = useState(null);

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

          <td className="action-cell">

            <button
              className="menu-btn"
              onClick={() =>
                setOpenMenu(
                  openMenu === employee.id
                    ? null
                    : employee.id
                )
              }
            >
              <FaEllipsisV className="icon"/>
            </button>

            {openMenu === employee.id && (
              <div className="action-menu">

                <button  className="ed-btn"
                  onClick={() => {
                    handleEdit(employee);
                    setOpenMenu(null);
                  }}
                >
                  Edit
                </button>

                <button  className="ed-btn"
                  onClick={() => {
                    handleDeleteEmployee(employee.id);
                    setOpenMenu(null);
                  }}
                >
                  Delete
                </button>

              </div>
            )}

          </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
};

export default EmployeeTable;