import {
  FaUsers,
  FaUserCheck,
  FaBuilding,
   FaClipboardCheck
} from "react-icons/fa";
const DashboardStats = ({ stats }) => {

  const cards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: <FaUsers />
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees,
      icon: <FaUserCheck />
    },
    {
      title: "Departments",
      value: stats.departments,
      icon: <FaBuilding />
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: <FaClipboardCheck />
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div
          key={index}
          className="stat-card"
        >
          <div className="stat-icon">
            {card.icon}
          </div>

          <div>
            <h4>{card.title}</h4>
            <h2>{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
