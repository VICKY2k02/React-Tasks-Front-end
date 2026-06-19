import React, { useEffect, useState } from "react";
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployeeStatus,
  updateEmployee,
  transferDepartment
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
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [transferEmployee, setTransferEmployee] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
 const [showTransferToast, setShowTransferToast] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");

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

    alert("Employee added successfully");


    console.log("ADD RESPONSE:", response);

    // RELOAD EMPLOYEES
    await fetchEmployees();

    // CLOSE MODAL
    setIsModalOpen(false);

  } catch (error) {

  const message =
    error.response?.data?.detail ||
    "Employee Add Failed";

  alert(message);

  console.log("ADD ERROR:", error);

}

};


// Delete handle


const handleDeleteEmployee = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure?"
  );

  if (!confirmDelete) return;

  try {

    await deleteEmployee(id);

    alert("Employee deleted");

    fetchEmployees();

  } catch (error) {

    console.log(error);

    alert("Delete failed");
  }
};

 // ADD STATUS HANDLER

const handleStatusChange = async (
  employeeId,
  status
) => {
  try {

    await updateEmployeeStatus(
      employeeId,
      status
    );

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? { ...emp, status }
          : emp
      )
    );

    setSelectedEmployee((prev) =>
      prev && prev.id === employeeId
        ? { ...prev, status }
        : prev
    );

  } catch (error) {

    console.log(error);

  }
};


// HANDLE EDIT

const handleEdit = (employee) => {

  setEditingEmployee(employee);

  setIsModalOpen(true);

};

// HANDLE UPDATE EMPLOYEE

const handleUpdateEmployee = async (
  employeeData
) => {

  try {

    await updateEmployee(
      editingEmployee.id,
      employeeData
    );

    alert("Employee updated successfully");

    fetchEmployees();

    setIsModalOpen(false);

    setEditingEmployee(null);

  } catch (error) {

    console.log(error);

    alert("Update failed");
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


// Handler:
  const handleTransfer = (employee) => {
  setTransferEmployee(employee);
  setNewDepartment(employee.department);
  setShowTransferModal(true);
};


const saveTransfer = async () => {
  try {
    await transferDepartment(
      transferEmployee.id,
      newDepartment
    );

    fetchEmployees();

    setShowTransferModal(false);
    setShowTransferToast(true);

    setTimeout(() => {
      setShowTransferToast(false);
    }, 3000);

  } catch (error) {
    console.log(error);
    alert("Transfer failed");
  }
};
  
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
        handleEdit={handleEdit}
        handleStatusChange={handleStatusChange}
        handleTransfer={handleTransfer}
      />

      <EmployeeProfilePreview employee={selectedEmployee} />
    </div>

    <Pagination
      totalEmployees={filteredEmployees.length}
      employeesPerPage={employeesPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />


    <AddEmployeeModal
      isOpen={isModalOpen}
      onClose={() => {
      setIsModalOpen(false);
      setEditingEmployee(null);
    }}
      onAddEmployee={
      editingEmployee
      ? handleUpdateEmployee
      : handleAddEmployee
    }
      editingEmployee={editingEmployee}
    />


     <div className="dashboard-container">

      {showTransferToast && (
        <div className="transfer-toast">
          ✅ Employee Transferred
        </div>
      )}

    {
    showTransferModal && (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Transfer Department</h3>

        <p>{transferEmployee?.name}</p>

        <select
          value={newDepartment}
          onChange={(e) =>
            setNewDepartment(e.target.value)
          }
        >
          <option>HR</option>
          <option>Engineering</option>
          <option>Finance</option>
        </select>

        <button onClick={saveTransfer}>
          Save
        </button>

        <button
          onClick={() =>
            setShowTransferModal(false)
          }
        >
          Cancel
        </button>
      </div>
    </div>
    )
    }
  </div>
  </div>
);
};

export default EmployeeDashboard;