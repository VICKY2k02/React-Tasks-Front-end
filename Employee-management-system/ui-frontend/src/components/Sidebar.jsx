import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaClipboardCheck,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

const Sidebar = () => {

  const navigate = useNavigate();

  const { user, logout } =
    useContext(AuthContext);

  const handleLogout = () => {

    logout();

    navigate("/");
  };

  return (

    <div className="sidebar">

      <h2 className="logo">
        EMS
      </h2>

      <nav>

        {/* Available for Admin & User */}
        <NavLink to="/dashboard">
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/employees">
          <FaUsers />
          Employees
        </NavLink>

        {/* Admin Only */}
        {user?.role === "admin" && (
          <>
            <NavLink to="/departments">
              <FaBuilding />
              Departments
            </NavLink>

            <NavLink to="/attendance">
              <FaClipboardCheck />
              Attendance
            </NavLink>

            <NavLink to="/settings">
              <FaCog />
              Settings
            </NavLink>
          </>
        )}

      </nav>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  );
};

export default Sidebar;