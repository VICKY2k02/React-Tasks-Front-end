
import "./styles.css"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FaUsers,
  FaUserCheck,
  FaClipboardCheck,
  FaBuilding,
} from "react-icons/fa";

const data = [
  { day: "Mon", employees: 120 },
  { day: "Tue", employees: 180 },
  { day: "Wed", employees: 220 },
  { day: "Thu", employees: 260 },
  { day: "Fri", employees: 190 },
  { day: "Sat", employees: 110 },
  { day: "Sun", employees: 130 },
];

function Dashboard() {
  return (
    
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>
              Monitor employee performance, attendance, and department
              activities.
            </p>
          </div>

          <div className="date-box">
            <h4>May 22, 2026</h4>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaUsers />
            </div>

            <div>
              <h4>Total Employees</h4>
              <h2>256</h2>
              <span className="success">+12.5%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <FaUserCheck />
            </div>

            <div>
              <h4>Active Employees</h4>
              <h2>210</h2>
              <span className="success">+7.3%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <FaClipboardCheck />
            </div>

            <div>
              <h4>Attendance</h4>
              <h2>92%</h2>
              <span className="success">+5.4%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <FaBuilding />
            </div>

            <div>
              <h4>Departments</h4>
              <h2>3</h2>
              <span>No Change</span>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="chart-section">
            <div className="section-header">
              <h3>Employee Analytics</h3>
              <button>This Week</button>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="employees"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="employee-section">
            <div className="section-header">
              <h3>Recent Employees</h3>
              <span>View All</span>
            </div>

            <div className="employee-list">
              <div className="employee-item">
                <div>
                  <h4>John Doe</h4>
                  <p>Frontend Developer</p>
                </div>

                <span>IT</span>
              </div>

              <div className="employee-item">
                <div>
                  <h4>Jane Smith</h4>
                  <p>UI/UX Designer</p>
                </div>

                <span>Design</span>
              </div>

              <div className="employee-item">
                <div>
                  <h4>Michael Johnson</h4>
                  <p>HR Manager</p>
                </div>

                <span>HR</span>
              </div>

              <div className="employee-item">
                <div>
                  <h4>Emily Davis</h4>
                  <p>Data Analyst</p>
                </div>

                <span>Analytics</span>
              </div>
            </div>
          </div>
        </div>

        <div className="extra-sections">
          <div className="palette-card">
            <h3>Color Palette</h3>

            <div className="colors">
              <div className="color blue-bg"></div>
              <div className="color dark-bg"></div>
              <div className="color light-bg"></div>
              <div className="color green-bg"></div>
              <div className="color orange-bg"></div>
              <div className="color red-bg"></div>
            </div>
          </div>

          <div className="guideline-card">
            <h3>UI/UX Guidelines</h3>

            <div className="guidelines">
              <div>Responsive Layout</div>
              <div>Modern UI</div>
              <div>Reusable Components</div>
              <div>Clean Typography</div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Dashboard;