import { useContext, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../pages/DashboardCompopnents/NotificationBell";
import { getReactivationRequests } from "../services/MemberServices";
import { getDashboardStats, getAuditLogs } from "../services/EmployeeService";
import {
  getAttendanceRequests
} from "../services/AttendanceServices";

import { getCompanyLeaves } from "../services/LeaveServicce";

function Header() {

  const { user } = useContext(AuthContext);

    const [ reactivationRequests, setReactivationRequests ] = useState([]);
const [leaveRequests,setLeaveRequests]=useState([]);
  const [pendingRequests, setPendingRequests] = useState(0);

  const [activities, setActivities] = useState([]);
const [ attendanceRequests,setAttendanceRequests] = useState([]);

const companyId = Number(user?.company_id);

const companyName =
  companyId === 1
    ? "Company A"
    : companyId === 2
    ? "Company B"
    : "Company";

useEffect(() => {
  if (!user) return;

  loadNotifications();

  const refresh = () => {
    loadNotifications();
  };

  window.addEventListener("dashboardRefresh", refresh);

  return () => {
    window.removeEventListener("dashboardRefresh", refresh);
  };
}, [user]);

const loadNotifications = async () => {
  try {
    const requests = await getReactivationRequests();
    setReactivationRequests(requests);

    let attendanceData = [];
    let leaveData = [];

    if (user?.role === "admin") {
      attendanceData = await getAttendanceRequests(
        companyId,
        user.email
      );
      setAttendanceRequests(attendanceData);

      const leaveRes = await getCompanyLeaves(companyId);
      console.log("leaveRes =", leaveRes);
      console.log("companyId:", companyId);

      leaveData = leaveRes.data.filter(
        leave => leave.status === "Pending"
      );

      setLeaveRequests(leaveData);

    } else {
      setAttendanceRequests([]);
      setLeaveRequests([]);
    }

    const stats = await getDashboardStats();
    const logs = await getAuditLogs();

    setActivities(logs.slice(0, 5));

    const roleRequestCount = stats.pendingRequests;

    const reactivationCount =
      requests.filter(r => r.status === "Pending").length;

    const attendanceCount =
      attendanceData.filter(r => r.status === "Pending").length;

    const leaveCount = leaveData.length;

    setPendingRequests(
      roleRequestCount 
      // reactivationCount 
      // attendanceCount +
      // leaveCount
    );

  } catch (error) {
    console.log(error);
  }
};


  return (

    <div className="header">

      <div className="company-name">
        <div>{companyName}</div>
      </div>

      <div className="header-right">

        <NotificationBell
          pendingRequests={ pendingRequests }
          // recentActivities={ activities }
          reactivationRequests={ reactivationRequests } 
          attendanceRequests={attendanceRequests}
          leaveRequests={leaveRequests}
        />

        <div className="profile">

          {
            user?.role === "admin"
              ? "Admin"
              : "User"
          }

        </div>

      </div>

      <ThemeToggle />

    </div>

  );
}

export default Header;