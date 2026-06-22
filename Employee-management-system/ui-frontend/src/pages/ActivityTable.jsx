import { useEffect, useState } from "react";
import {
getActivityLogs,
clearActivityLogs
} from "../services/ActivityService";
import "./ActivityTable.css";

function ActivityTable() {
const [logs, setLogs] = useState([]);

useEffect(() => {
loadLogs();
}, []);

const loadLogs = async () => {
try {
const data = await getActivityLogs();
setLogs(data);
} catch (error) {
console.error("Activity API Error:", error);
}
};

const handleClear = async () => {
const ok = window.confirm(
"Clear all activity logs?"
);


if (!ok) return;

await clearActivityLogs();
setLogs([]);


};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata"
    }
  );
};

return ( 
  <div className="activity-page"> 
  <div className="activity-header"> 
    <h2>Account Activity</h2>

    <button
      className="clear-btn"
      onClick={handleClear}
    >
      Clear Logs
    </button>
  </div>

  <div className="activity-card">
    <table className="activity-table">
      <thead>
        <tr>
          <th>USER</th>
          <th>LAST LOGIN</th>
          <th>LAST LOGOUT</th>
          <th>BROWSER</th>
          <th>IP ADDRESS</th>
          
        </tr>
      </thead>

      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>
              <div className="user-name">
                {log.user_email?.split("@")[0]}
              </div>

              <div className="user-email">
                {log.user_email}
              </div>
            </td>

            <td>
              {formatDate(log.last_login)}
            </td>

            <td>
              {log.last_logout
                ? formatDate(log.last_logout)
                : "Active"}
            </td>

            <td>
              {log.browser || "Chrome"}
            </td>

            <td>
              {log.ip_address || "—"}
            </td>

            
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


);
}

export default ActivityTable;
