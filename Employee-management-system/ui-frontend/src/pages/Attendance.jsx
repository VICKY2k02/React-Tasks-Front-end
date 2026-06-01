import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getEmployees } from "../services/EmployeeService";

import "./styles.css"

const Attendance = () => {

  const { user } = useContext(AuthContext);

  const downloadExcel = async () => {

    try {

      const employees = await getEmployees();

      if (!employees || employees.length === 0) {
        alert("No employee data found");
        return;
      }

      const employeeData = employees.map((emp) => ({
        ID: emp.id,
        Name: emp.name,
        Email: emp.email,
        Department: emp.department,
        Designation: emp.designation,
        Attendance: emp.attendance,
        Status: emp.status
      }));

      const worksheet =
        XLSX.utils.json_to_sheet(employeeData);

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Attendance Report"
      );

      const excelBuffer =
        XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array"
        });

      const file = new Blob(
        [excelBuffer],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
        }
      );

      saveAs(
        file,
        "attendance_report.xlsx"
      );

    } catch (error) {

      console.error(
        "Excel Download Error:",
        error
      );

      alert(
        "Failed to download report"
      );
    }
  };

  return (
    <div className="attendance-page">

      <h1>
        Attendance Management
      </h1>

      <p>
        Download employee attendance reports.
      </p>

      {
        user?.role === "admin" && (
          <button
            className="download-btn"
            onClick={downloadExcel}
          >
            Download Excel Report
          </button>
        )
      }

      {
        user?.role !== "admin" && (
          <p className="access-msg">
            Only Admin can download reports.
          </p>
        )
      }

    </div>
  );
};

export default Attendance;