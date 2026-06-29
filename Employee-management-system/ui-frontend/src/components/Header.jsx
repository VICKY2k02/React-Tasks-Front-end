import { useContext, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../pages/DashboardCompopnents/NotificationBell";

import {
  getReactivationRequests,
  approveReinstatement,
  rejectReinstatement,
  getAdminNotifications
} from "../services/MemberServices";

import {
  getDashboardStats,
  getAuditLogs
} from "../services/EmployeeService";

import {
  getAttendanceRequests
} from "../services/AttendanceServices";

import { getCompanyLeaves } from "../services/LeaveServicce";

function Header() {
  const { user } = useContext(AuthContext);

  const [reactivationRequests, setReactivationRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [activities, setActivities] = useState([]);
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const companyId = Number(user?.company_id);

  const companyName =
    companyId === 1
      ? "Company A"
      : companyId === 2
      ? "Company B"
      : "Company";

  // const handleApprove = async (email) => {
  //   try {
  //     await approveReinstatement(email);
  //     loadNotifications();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleReject = async (email) => {
  //   try {
  //     await rejectReinstatement(email);
  //     loadNotifications();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleApprove = async (email) => {
    await approveReinstatement(email);
    await loadNotifications();
  };

  const handleReject = async (email) => {
    await rejectReinstatement(email);
    await loadNotifications();
  };

  const loadNotifications = async () => {
    try {
      const adminNotifications =
        await getAdminNotifications(user.email);

      setNotifications(adminNotifications);

      const requests =
        await getReactivationRequests();

      setReactivationRequests(requests);

      let attendanceData = [];
      let leaveData = [];

      if (user?.role === "admin") {
        attendanceData = await getAttendanceRequests(
          companyId,
          user.email
        );

        setAttendanceRequests(attendanceData);

        const leaveRes =
          await getCompanyLeaves(companyId);

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

      const roleRequestCount =
        stats.pendingRequests;

        setPendingRequests(stats.pendingRequests);

  //     const reactivationCount =
  //       requests.filter(
  //         r => r.status === "Pending"
  //       ).length;

  //     const attendanceCount =
  //       attendanceData.filter(
  //         r => r.status === "Pending"
  //       ).length;

  // //       const reinstatementCount =
  // // adminNotifications.filter(
  // //   n => n.type === "reinstatement" &&
  // //        n.status === "Pending"
  // // ).length;

  //     const leaveCount = leaveData.length;

  //     const notificationCount =
  //       adminNotifications.filter(
  //         n => n.type === "reinstatement"
  //       ).length;

  //     setPendingRequests(
  //       roleRequestCount +
  //       reactivationCount +
  //       attendanceCount +
  //       leaveCount +
  //       notificationCount
  //     );

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) return;

    loadNotifications();

    const refresh = () => {
      loadNotifications();
    };

    window.addEventListener(
      "dashboardRefresh",
      refresh
    );

    return () => {
      window.removeEventListener(
        "dashboardRefresh",
        refresh
      );
    };
  }, [user]);

  return (
    <div className="header">
      <div className="company-name">
        <div>{companyName}</div>
      </div>

      <div className="header-right">
        <NotificationBell
          notifications={notifications}
          pendingRequests={pendingRequests}
          leaveRequests={leaveRequests}
          attendanceRequests={attendanceRequests}
          reactivationRequests={reactivationRequests}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        <div className="profile">
          {user?.role === "admin"
            ? "Admin"
            : "User"}
        </div>
      </div>

      <ThemeToggle />
    </div>
  );
}

export default Header;