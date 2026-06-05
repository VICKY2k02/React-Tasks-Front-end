import { useContext } from "react";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext";
import { IoMdNotificationsOutline } from "react-icons/io";

function Header() {

  const { user } = useContext(AuthContext);

    const companyName =
    user?.company_id == 1
      ? "Company A"
      : user?.company_id === 2
      ? "Company B"
      : "Company";

  return (

    <div className="header">

      {/* Company Name */}
      <div className="company-name">
        🏢 {companyName}
      </div>

      <div className="header-right">

        <div className="nav-right">
          <IoMdNotificationsOutline className="bell-icon" />
        </div>

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