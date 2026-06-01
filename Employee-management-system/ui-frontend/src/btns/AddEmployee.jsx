// import React, { useState, useEffect } from "react";

// import "../btns/AddEmployee.css";

// const AddEmployeeModal = ({
//   isOpen,
//   onClose,
//   onAddEmployee,
//   editingEmployee
// }) => {

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     department: "",
//     designation: "",
//     attendance: "",
//     status: "",
//   });

// useEffect(() => {

//   if (editingEmployee) {

//     setFormData({
//       name: editingEmployee.name || "",
//       email: editingEmployee.email || "",
//       department: editingEmployee.department || "",
//       designation: editingEmployee.designation || "",
//       attendance: editingEmployee.attendance || "",
//       status: editingEmployee.status || "Active"
//     });

//   }

// }, [editingEmployee]);
 

//   const handleChange = (e) => {

//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });

//   };

//   const handleSubmit = (e) => {

//     e.preventDefault();

//     console.log("FORM DATA:", formData);

//     onAddEmployee(formData);

//     setFormData({
//       name: "",
//       email: "",
//       department: "",
//       designation: "",
//       attendance: "",
//       status: "",
//     });

//     onClose();
//   };

//   if (!isOpen) return null;

//   return (

//     <div className="modal-overlay">

//       <div className="modal-container">

//         <div className="modal-header">

//           <h2>Add Employee</h2>

//           <button
//             className="close-btn"
//             onClick={onClose}
//           >
//             ×
//           </button>

//         </div>

//         <form onSubmit={handleSubmit}>

//           <input
//             type="text"
//             name="name"
//             placeholder="Employee Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Employee Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="text"
//             name="department"
//             placeholder="Department"
//             value={formData.department}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="text"
//             name="designation"
//             placeholder="Designation"
//             value={formData.designation}
//             onChange={handleChange}
//             required
//           />

//           {/* FIXED ATTENDANCE INPUT */}

//           <input
//             type="text"
//             name="attendance"
//             placeholder="Attendance %"
//             value={formData.attendance}
//             onChange={handleChange}
//             required
//           />

//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             required
//           >

//             <option value="">
//               Select Status
//             </option>

//             <option value="Active">
//               Active
//             </option>

//             <option value="Inactive">
//               Inactive
//             </option>

//             <option value="On Leave">
//                On Leave
//             </option>

//           </select>

//           <button
//             type="submit"
//             className="submit-btn"
//           >
//                       {
//             editingEmployee
//               ? "Update Employee"
//               : "Add Employee"
//           }
//           </button>

//         </form>

//       </div>

//     </div>
//   );
// };

// export default AddEmployeeModal;

import React, { useState, useEffect } from "react";
import "../btns/AddEmployee.css";

const AddEmployeeModal = ({
  isOpen,
  onClose,
  onAddEmployee,
  editingEmployee,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    attendance: "",
    status: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name || "",
        email: editingEmployee.email || "",
        department: editingEmployee.department || "",
        designation: editingEmployee.designation || "",
        attendance: editingEmployee.attendance || "",
        status: editingEmployee.status || "Active",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        department: "",
        designation: "",
        attendance: "",
        status: "",
      });
    }
  }, [editingEmployee]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      department: "",
      designation: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
      isValid = false;
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Role is required";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("FORM DATA:", formData);

    onAddEmployee(formData);

    setFormData({
      name: "",
      email: "",
      department: "",
      designation: "",
      attendance: "",
      status: "",
    });

    setErrors({
      name: "",
      email: "",
      department: "",
      designation: "",
    });

    onClose();
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.department.trim() !== "" &&
    formData.designation.trim() !== "";

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>
            {editingEmployee
              ? "Update Employee"
              : "Add Employee"}
          </h2>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Employee Name"
            value={formData.name}
            onChange={handleChange}
          />

          {errors.name && (
            <p className="error-text">{errors.name}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Employee Email"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && (
            <p className="error-text">{errors.email}</p>
          )}

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
          />

          {errors.department && (
            <p className="error-text">{errors.department}</p>
          )}

          <input
            type="text"
            name="designation"
            placeholder="Role"
            value={formData.designation}
            onChange={handleChange}
          />

          {errors.designation && (
            <p className="error-text">
              {errors.designation}
            </p>
          )}

          <input
            type="text"
            name="attendance"
            placeholder="Attendance %"
            value={formData.attendance}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">
              Select Status
            </option>
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

          <button
            type="submit"
            className="submit-btn"
            disabled={!isFormValid}
          >
            {editingEmployee
              ? "Update Employee"
              : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;