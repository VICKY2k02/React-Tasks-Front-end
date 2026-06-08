import { useContext, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext";

import NotificationBell from
"../pages/DashboardCompopnents/NotificationBell";

import {
  getDashboardStats,
  getAuditLogs
} from "../services/EmployeeService";

function Header() {

  const { user } =
    useContext(AuthContext);

  const [pendingRequests,
    setPendingRequests] = useState(0);

  const [activities,
    setActivities] = useState([]);

const companyId = Number(user?.company_id);

const companyName =
  companyId === 1
    ? "Company A"
    : companyId === 2
    ? "Company B"
    : "Company";

  useEffect(() => {

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

  }, []);

  const loadNotifications =
    async () => {

      try {

        const stats =
          await getDashboardStats();

        setPendingRequests(
          stats.pendingRequests
        );

        const logs =
          await getAuditLogs();

        setActivities(
          logs.slice(0, 5)
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
          pendingRequests={
            pendingRequests
          }
          recentActivities={
            activities
          }
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