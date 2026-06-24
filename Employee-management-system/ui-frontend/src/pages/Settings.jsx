import { useState, useContext, useEffect, useCallback } from "react";
import AdminLeaveRequests from "./AdminLeaveRequests";
import {
  requestRoleChange,
  getRoleRequests,
  approveRoleRequest,
  rejectRoleRequest
} from "../services/EmployeeService";
import ReactivationRequests from "./Members/ReactivationRequest";
import { AuthContext } from "../context/AuthContext";
import "./Members/Members.css"
const Settings = () => {

  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);

  const [formData, setFormData] = useState({
   name:"",
  // email:"",
  password:"",
  confirmPassword:"",
  role:"user",
  company_id:1,
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
              <hr/>
          {/* Reactivation Requests */}

          <div className="reactivation-section">

            <h2 className="section-title">
              Reactivation Requests
            </h2>

            <ReactivationRequests />

          </div>

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

      <hr />
{user?.role === "admin" && (
    <div className="leave-section">
          <h2>Leave Request</h2>

        <AdminLeaveRequests />

    </div>
)}
    </div>

  
            </div>
    

  );

};

export default Settings;