import { useEffect, useState } from "react";

import { getAuditLogs } from "../../services/EmployeeService";

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

  return (

 <div className="auditlogs-container">

  <h1 className="auditlogs-title">
    Audit Logs
  </h1>

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