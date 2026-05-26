import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaClipboardCheck,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">EMS</h2>

      <nav>
        <NavLink to="/dashboard">
          <FaHome /> Dashboard
        </NavLink>

        <NavLink to="/employees">
          <FaUsers /> Employees
        </NavLink>

        <NavLink to="/departments">
          <FaBuilding /> Departments
        </NavLink>

        <NavLink to="/attendance">
          <FaClipboardCheck /> Attendance
        </NavLink>

        <NavLink to="/settings">
          <FaCog /> Settings
        </NavLink>

      </nav>

    </div>
  );
};

export default Sidebar;