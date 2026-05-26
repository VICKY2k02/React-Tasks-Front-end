import ThemeToggle from "./ThemeToggle";

function Header() {
  return (
    <div className="header">
      <input type="text" placeholder="Search here..." />

      <div className="header-right">
        <span className="notification">🔔</span>

        <div className="profile">
          Admin User
        </div>
      </div>
      <ThemeToggle/>
    </div>
  );
}

export default Header;