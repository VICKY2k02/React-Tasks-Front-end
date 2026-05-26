// import React, { useState } from "react";
// import employeesData from "../Employees-details/data/employees.json"
// import EmployeeTable from "../Employees-details/components/EmployeeTable"
// import EmployeeProfilePreview from "../Employees-details/components/EmployeeProfilePreview"
// import SearchFilter from "./components/SearchFilter";
// import DashboardStats from "./components/DashBoardStata";
// import Pagination from "../Employees-details/components/Pagination"
// import "../Employees-details/Styles.css"

// const EmployeeDashboard = () => {
//   const [employees] = useState(employeesData);
//   const [search, setSearch] = useState("");
//   const [department, setDepartment] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const employeesPerPage = 5;

//   const filteredEmployees = employees.filter((employee) => {
//     return (
//       employee.name.toLowerCase().includes(search.toLowerCase()) &&
//       (department === "" || employee.department === department)
//     );
//   });

//   const indexOfLastEmployee = currentPage * employeesPerPage;
//   const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

//   const currentEmployees = filteredEmployees.slice(
//     indexOfFirstEmployee,
//     indexOfLastEmployee
//   );

//   return (
//     <div className="dashboard-container">

//       <div className="dashboard-header">
//         <h1>Employee Dashboard</h1>

//         <button className="add-btn">
//           + Add Employee
//         </button>
//       </div>

//       <DashboardStats employees={employees} />

//       <SearchFilter
//         search={search}
//         setSearch={setSearch}
//         department={department}
//         setDepartment={setDepartment}
//       />

//       <div className="dashboard-contents">

//         <EmployeeTable
//           employees={currentEmployees}
//           setSelectedEmployee={setSelectedEmployee}
//         />

//         <EmployeeProfilePreview employee={selectedEmployee} />

//       </div>

//       <Pagination
//         totalEmployees={filteredEmployees.length}
//         employeesPerPage={employeesPerPage}
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//       />

//       <div className="placeholder-sections">

//         <div className="placeholder-card">
//           <h3>Employee Details</h3>
//           <p>Employee information section placeholder.</p>
//         </div>

//         <div className="placeholder-card">
//           <h3>Department Section</h3>
//           <p>Department management placeholder.</p>
//         </div>

//         <div className="placeholder-card">
//           <h3>Attendance Section</h3>
//           <p>Attendance tracking placeholder.</p>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default EmployeeDashboard;

// i'm writing new code beacause im getting errors to import data from back-end thats why im writing new code in the same file.

import React, { useEffect, useState } from "react";
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployeeStatus
} from "../../services/EmployeeService";

import EmployeeTable from "../Employees-details/components/EmployeeTable";
import EmployeeProfilePreview from "../Employees-details/components/EmployeeProfilePreview";
import SearchFilter from "./components/SearchFilter";
import DashboardStats from "./components/DashBoardStata";
import Pagination from "../Employees-details/components/Pagination";
import AddEmployeeModal from "../../btns/AddEmployee";

import "../Employees-details/Styles.css";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const employeesPerPage = 5;

  // FIXED API CALL

useEffect(() => {
  fetchEmployees();
}, []);

const fetchEmployees = async () => {

  try {

    setLoading(true);

    const response = await getEmployees();

    console.log("API RESPONSE:", response);

    let employeesData = [];

    if (Array.isArray(response)) {

      employeesData = response;

    } else if (Array.isArray(response.data)) {

      employeesData = response.data;

    } else {

      employeesData = [];
    }

    setEmployees(employeesData);

    if (employeesData.length > 0) {
      setSelectedEmployee(employeesData[0]);
    }

  } catch (error) {

    console.log(error);

    setError("Failed to fetch employees");

  } finally {

    setLoading(false);
  }
};


  //Add Employee

const handleAddEmployee = async (employeeData) => {

  try {

    console.log("SENDING DATA:", employeeData);

    const response = await addEmployee(employeeData);

    console.log("ADD RESPONSE:", response);

    // RELOAD EMPLOYEES
    await fetchEmployees();

    // CLOSE MODAL
    setIsModalOpen(false);

  } catch (error) {

    console.log("ADD ERROR:", error);

  }

};


// Delete handle

const handleDeleteEmployee = async (id) => {

  try {

    await deleteEmployee(id);

    fetchEmployees();

  } catch (error) {

    console.log(error);

  }

};



// ADD STATUS HANDLER
const handleStatusToggle = async (
  employee
) => {

  try {

    const newStatus =
      employee.status === "Active"
        ? "Inactive"
        : "Active";

    await updateEmployeeStatus(
      employee.id,
      newStatus
    );

    fetchEmployees();

  } catch (error) {

    console.log(error);

  }

};


const filteredEmployees = Array.isArray(employees)
  ? employees.filter((employee) => {

      return (
        employee.name?.toLowerCase().includes(
          search.toLowerCase()
        ) &&
        (
          department === "" ||
          employee.department === department
        )
      );
    })
  : [];
  // Pagination
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Loading
  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading Employees...</h2>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="dashboard-container">
        <h2 style={{ color: "red" }}>{error}</h2>
        <button onClick={fetchEmployees} className="add-btn">
          Retry
        </button>
      </div>
    );
  }

  // Empty
  if (employees.length === 0) {
    return (
      <div className="dashboard-container">
        <h2>No Employees Found</h2>
      </div>
    );
  }

  
  return (
  <div className="dashboard-container">

    <div className="dashboard-header">
      <h1>Employee Dashboard</h1>


    <button
      className="add-btn"
      onClick={() => setIsModalOpen(true)}
    >
      + Add Employee
    </button>
        </div>

    <DashboardStats employees={employees} />

    <SearchFilter
      search={search}
      setSearch={setSearch}
      department={department}
      setDepartment={setDepartment}
    />

    <div className="dashboard-contents">
      <EmployeeTable
        employees={currentEmployees}
        setSelectedEmployee={setSelectedEmployee}
        handleDeleteEmployee={handleDeleteEmployee}
        handleStatusToggle={handleStatusToggle}
      />

      <EmployeeProfilePreview employee={selectedEmployee} />
    </div>

    <Pagination
      totalEmployees={filteredEmployees.length}
      employeesPerPage={employeesPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />

    {/* <AddEmployeeModal
      isOpen={isshowModal}
      onClose={() => setShowModal(false)}
      onAddEmployee={handleAddEmployee}
    /> */}
<AddEmployeeModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onAddEmployee={handleAddEmployee}
/>
  </div>
);
};

export default EmployeeDashboard;