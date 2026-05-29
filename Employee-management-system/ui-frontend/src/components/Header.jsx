import { useContext } from "react";

import ThemeToggle from "./ThemeToggle";

import { AuthContext } from "../context/AuthContext";


function Header() {

  const { user } =
    useContext(AuthContext);

  return (

    <div className="header">

      <input
        type="text"
        placeholder="Search here..."
      />

      <div className="header-right">

        <span className="notification">
          🔔
        </span>

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