import {
  FaUsers,
  FaUserCheck,
  FaBuilding,
  FaClipboardCheck
} from "react-icons/fa";

const DashboardStats = ({ employees }) => {

  const totalEmployees = employees.length;

  const activeEmployees =
    employees.filter(
      emp => emp.status === "Active"
    ).length;

  const departments =
    [...new Set(
      employees.map(
        emp => emp.department
      )
    )].length;

    const attendance =
    employees.length > 0
    ? (
         employees.reduce(
            (sum, emp) =>
                sum +
            parseFloat(emp.attendance.replace("%","")),
            0
        ) / employees.length
    ).toFixed(1): 0;

    
  const cards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: <FaUsers />
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: <FaUserCheck />
    },
    {
      title: "Departments",
      value: departments,
      icon: <FaBuilding />
    },
    {
      title: "Attendance %",
      value: `${attendance}%`,
      icon: <FaClipboardCheck />
    }
  ];

  return (
    <div className="stats-grid">

      {cards.map((card,index)=>(
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