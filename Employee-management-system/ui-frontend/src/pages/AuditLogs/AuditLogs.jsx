import { useEffect, useState } from "react";

import { getAuditLogs, clearAuditLogs } from "../../services/EmployeeService";

import "./AuditLogs.css";

function AuditLogs() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {

    loadLogs();

  }, []);

  const loadLogs = async () => {
    

    const data =
      await getAuditLogs();

    setLogs(data);

  };

        const handleClearAuditLogs = async () => {
  
    const confirmClear = window.confirm(
      "Are you sure you want to clear all audit logs?"
    );
  
    if (!confirmClear) return;
  
    try {
  
      const response =
        await clearAuditLogs();
  
      alert(response.message);
  
    } catch (error) {
  
      alert(
        error.response?.data?.detail ||
        "Failed to clear audit logs"
      );
  
    }
  };

  return (

 <div className="auditlogs-container">

    <div className="auditlogs-header">
      <h1 className="auditlogs-title">
        Audit Logs
      </h1>

      <button
        className="clear-audit-btn"
        onClick={handleClearAuditLogs}
      >
        Clear Audit Logs
      </button>
  </div>

  <div className="auditlogs-card">

    <table className="auditlogs-table">

      <thead>
        <tr>
          <th>User</th>
          <th>Action</th>
          <th>Related User</th>
          <th>Timestamp</th>
        </tr>
      </thead>

      <tbody>

        {logs.map((log) => (
          <tr key={log.id}>

            <td>{log.user_name}</td>

            <td>
              <span
                className={`action-badge ${
                  log.action
                    .toLowerCase()
                    .replace(/\s/g, "-")
                }`}
              >
                {log.action}
              </span>
            </td>

            <td>{log.related_user}</td>

            <td>
                {new Date(log.timestamp).toLocaleString(
                    "en-IN",
                    {
                    timeZone: "Asia/Kolkata"
                    }
                )}
            </td>

          </tr>
        ))}

      </tbody>

    </table>

  </div>

</div>
  );
}

export default AuditLogs;