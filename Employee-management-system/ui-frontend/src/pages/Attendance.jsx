import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { getEmployees } from "../services/EmployeeService";
import Leave from "./Leave";

// services import
import {
  getAttendanceAccess,
  getAttendanceHistory,
  punchInAPI,
  punchOutAPI,
  getTodayAttendance,
  getTotalHours
} from "../services/AttendanceServices";

import "./styles.css";

const Attendance = () => {
  const { user } = useContext(AuthContext);

  const [accessData, setAccessData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [attendance, setAttendance] = useState([]);


  const [
  todayAttendance,
  setTodayAttendance
] = useState({});

const [totalHours, setTotalHours] =
  useState("00:00:00");

  // FETCH ACCESS

const fetchAccess = async () => {
  try {
    const res = await getAttendanceAccess(user.email);

    setAccessData(res.data);

    //  IMPORTANT FIX:
    if (res.data?.approved === false && !res.data?.submitted_on) {
      await getAttendanceAccess(user.email); // force trigger backend request
    }

  } catch (err) {
    console.error(err);
  }
};

  // FETCH HISTORY

const fetchAttendance = async () => {
  try {
    const res = await getAttendanceHistory(user.email);

    console.log("History API:", res.data); // debug

    setAttendance(
      Array.isArray(res.data)
        ? res.data
        : []
    );
  } catch (err) {
    console.log(err);
  }
};


  // PUNCH IN

const punchIn = async () => {
  setTotalHours("00:00:00");

  await punchInAPI(user.email);

  await refreshAttendanceData();
  await fetchAccess();
};


  // PUNCH OUT


const punchOut = async () => {
  try {
    await punchOutAPI(user.email);

    await refreshAttendanceData();
    await fetchAccess();
    await fetchAttendance();
  } catch (err) {
    console.error(
      err.response?.data || err
    );
  }
};

const refreshAttendanceData = async () => {

  await fetchAttendance();

  const todayRes =
    await getTodayAttendance(
      user.email
    );

  setTodayAttendance(
    todayRes.data || {}
  );

  const hoursRes =
    await getTotalHours(
      user.email
    );

  setTotalHours(
    hoursRes.data.total_hours || 0
  );
};

  // INITIAL LOAD

useEffect(() => {
const loadData = async () => {
  if (user?.email) {
    await fetchAccess();
    await fetchAttendance();

    const todayRes =
      await getTodayAttendance(
        user.email
      );

    setTodayAttendance(
      todayRes.data || {}
    );

    const hoursRes =
  await getTotalHours(
    user.email
  );

console.log(
  "TOTAL HOURS API:",
  hoursRes.data
);

setTotalHours(
  hoursRes.data.total_hours || 0
);
  }

  setLoading(false);
};

  loadData();
}, [user]);
 


const formatTime = (seconds) => {
  if (!seconds) return "00:00:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

  // EXCEL DOWNLOAD (ADMIN)


  const downloadExcel = async () => {
    try {
      const employees = await getEmployees();

      if (!employees?.length) {
        alert("No data found");
        return;
      }

      const data = employees.map((emp) => ({
        ID: emp.id,
        Name: emp.name,
        Email: emp.email,
        Department: emp.department,
        Designation: emp.designation,
        Attendance: emp.attendance,
        Status: emp.status,
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Attendance");

      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });

      const file = new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(file, "attendance.xlsx");
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };


  // LOADING

  if (loading) return <h3>Loading...</h3>;


  // ACCESS PENDING SCREEN

if (
  user?.role === "user" &&
  accessData &&
  accessData.approved !== true
) {
  return (
    <div className="attendance-page">
      <h1>Attendance Access Pending</h1>

      <p>
        Your account is not linked to an employee profile yet.
        A request has been sent to your company admin
        for approval.
      </p>

      <p>
        <b>Submitted on:</b>
        {accessData.submitted_on}
      </p>
    </div>
  );
}return (
    <div className="attendance-page">
      <h1>Attendance Module</h1>

      {/* ADMIN VIEW */}
      {user?.role === "admin" && (
        <div className="admin-section">
          <h3>Admin Controls</h3>

          <button className="download-btn" onClick={downloadExcel}>
            Download Excel Report
          </button>
        </div>
      )}

     
      {/* USER VIEW */}
{user?.role === "user" && (

  <div className="attendance-container">

  <div className="summary-row">

    <div className="summary-card">
      <h3>Today</h3>

      <p>
        Check-in:
        {" "}
        {
          todayAttendance?.check_in
          ? new Date(
              todayAttendance.check_in
            ).toLocaleTimeString()
          : "-"
        }
      </p>

      <p>
        Check-out:
        {" "}
        {
          todayAttendance?.check_out
          ? new Date(
              todayAttendance.check_out
            ).toLocaleTimeString()
          : "-"
        }
      </p>
    </div>

    <div className="summary-card">
      <h3>Total Hours</h3>
      <h1>{totalHours}</h1>
    </div>

    <div className="summary-card actions">
      <button onClick={punchIn}>
        Check In
      </button>

      <button onClick={punchOut}>
        Check Out
      </button>
    </div>

  </div>

 <div className="recent-card">
  <h2>Recent Attendance</h2>

  <table className="attendance-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>In</th>
        <th>Out</th>
        <th>Hours</th>
      </tr>
    </thead>

    <tbody>
      {attendance.map((item, index) => (
        <tr key={index}>
          <td>{item.date}</td>

          <td>
            {item.check_in
              ? new Date(item.check_in).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"}
          </td>

          <td>
            {item.check_out
              ? new Date(item.check_out).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"}
          </td>

          {/* <td>{item.hours || "00:00:00"}</td> */}
          <td>{formatTime(item.hours)}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<div className="leave-section">
      <Leave />
    </div>

</div>
)}
    </div>
  );
};

export default Attendance;