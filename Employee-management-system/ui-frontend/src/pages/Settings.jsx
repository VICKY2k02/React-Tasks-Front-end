import { useState, useContext, useEffect, useCallback } from "react";

import {
  requestRoleChange,
  getRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
  clearAuditLogs
} from "../services/EmployeeService";

import { AuthContext } from "../context/AuthContext";

const Settings = () => {

  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);

  const [formData, setFormData] = useState({
    current_password: "",
    admin_email: ""
  });


const loadRequests = useCallback(async () => {

  if (!user?.email) return;

  const data = await getRoleRequests(
    user.email
  );

  console.log("ROLE REQUESTS:", data);

  setRequests(data);

}, [user]);


     useEffect(() => {

      if (user?.role === "admin") {
        loadRequests();
      }

    }, [user?.role, loadRequests]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const response =
      await requestRoleChange({
        user_email: user?.email,
        current_password: formData.current_password,
        admin_email: formData.admin_email
      });

    alert(response.message);

    setFormData({
      current_password: "",
      admin_email: ""
    });

  } catch (error) {

    const detail =
      error.response?.data?.detail;

    if (Array.isArray(detail)) {

      alert(
        detail[0]?.msg ||
        "Validation Error"
      );

    } else {

      alert(
        detail ||
        "Something went wrong"
      );

    }

  }

};

 const handleApprove = async (
  userEmail
) => {

  try {

    const response =
      await approveRoleRequest(
        userEmail
      );

    alert(response.message);

    loadRequests();

    window.dispatchEvent(
      new Event("dashboardRefresh")
    );

  } catch (error) {

    alert(
      error.response?.data?.detail
    );

  }
};
const handleReject = async (
  userEmail
) => {

  try {

    const response =
      await rejectRoleRequest(
        userEmail
      );

    alert(response.message);

    loadRequests();

    window.dispatchEvent(
      new Event("dashboardRefresh")
    );

  } catch (error) {

    alert(
      error.response?.data?.detail
    );

  }
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

    <div className="settings-page">
  <h1 className="settings-title">Settings</h1>

    <div className="settings-page">

      {/* ADMIN VIEW */}

      {user?.role === "admin" && (

        <div className="requests-container">

          <h2>
            Pending Role Requests
          </h2>

          {requests.length === 0 ? (

            <p>
              No requests found
            </p>

          ) : (

            requests.map(
              (request, index) => (

                <div
                  key={index}
                  className="request-card"
                >

                  <p>
                    <strong>
                      User:
                    </strong>{" "}
                    {request.user_email}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {request.status}
                  </p>

                  <div className="request-actions">

                    <button
                      className="approve-btn"
                      onClick={() =>
                        handleApprove(request.user_email)
                      }
                    >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleReject(request.user_email)
                        }
                      >
                        Reject
                    </button>

                  </div>


                </div>

              )
            )

          )}

        </div>

      )}

      {/* USER VIEW */}

      {user?.role === "user" && (

        <div className="form-card">

          <h2 className="role">
            Request Admin Role
          </h2>

          <form className="form" onSubmit={handleSubmit}>
            <input
              className="settings-input"
              type="password"
              name="current_password"
              placeholder="Current Password"
              value={formData.current_password}
              onChange={handleChange}
            />

            <input
              className="settings-input"
              type="email"
              name="admin_email"
              placeholder="Admin Email"
              value={formData.admin_email}
              onChange={handleChange}
            />

            <button
              className="submit-btn1"
              type="submit"
            >
              Submit Request
            </button>
          </form>

        </div>

      )}

    </div>
            {user?.role === "admin" && (

          <div className="audit-settings">

                    <h2>Audit Logs</h2>

                    <button
                      className="clear-audit-btn"
                      onClick={handleClearAuditLogs}
                    >
                      Clear Audit Logs
                    </button>

                  </div>

                )}
            </div>
    

  );

};

export default Settings;