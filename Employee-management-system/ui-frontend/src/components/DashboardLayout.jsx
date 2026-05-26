import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"
import Navbar from "./Navbar"




const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
        
      <div className="main-section">
        <Navbar />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;