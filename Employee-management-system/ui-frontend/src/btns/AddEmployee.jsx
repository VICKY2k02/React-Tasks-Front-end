// import React, { useState } from "react";

// import "../btns/AddEmployee.css";

// const AddEmployeeModal = ({
//   isOpen,
//   onClose,
//   onAddEmployee
// }) => {

//   const [attendance, setAttendance] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     department: "",
//     designation: "",
//     attendance:"",
//     status: "",
//   });

//   const handleChange = (e) => {

//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });

//   };

//   const handleSubmit = (e) => {

//     e.preventDefault();

//     console.log(formData);

//     onAddEmployee(formData);

//     setFormData({
//       name: "",
//       email: "",
//       department: "",
//       designation: "",
//       status: "",
//       attendance:""
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

//           <input
//           type="text"
//           placeholder="Attendance %"
//           value={attendance}
//           onChange={(e) =>
//             setAttendance(e.target.value)
//           }
//         />

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

//           </select>

//           <button
//             type="submit"
//             className="submit-btn"
//           >
//             Add Employee
//           </button>

//         </form>

//       </div>

//     </div>
//   );
// };

// export default AddEmployeeModal;


import React, { useState } from "react";

import "../btns/AddEmployee.css";

const AddEmployeeModal = ({
  isOpen,
  onClose,
  onAddEmployee,
}) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    attendance: "",
    status: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

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

    onClose();
  };

  if (!isOpen) return null;

  return (

    <div className="modal-overlay">

      <div className="modal-container">

        <div className="modal-header">

          <h2>Add Employee</h2>

          <button
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
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Employee Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />

          {/* FIXED ATTENDANCE INPUT */}

          <input
            type="text"
            name="attendance"
            placeholder="Attendance %"
            value={formData.attendance}
            onChange={handleChange}
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
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

          </select>

          <button
            type="submit"
            className="submit-btn"
          >
            Add Employee
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddEmployeeModal;