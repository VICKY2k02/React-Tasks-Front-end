import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getCompanyLeaves,
  approveLeave,
  rejectLeave
} from "../services/LeaveServicce";
import "./AttendanceRequest.css"
const AdminLeaveRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

const loadRequests = async () => {
  const res = await getCompanyLeaves(user.company_id);

  // Pending requests matrame
  setRequests(
    res.data.filter((req) => req.status === "Pending")
  );
};

  useEffect(() => {
    loadRequests();
  }, []);

  return (
<div className="admin-leave-container">

  {requests.length === 0 ? (

    <p className="no-requests">
      No Leave Requests Found
    </p>

  ) : (

    requests.map((req) => (

      <div
        key={req.id}
        className="leave-card"
      >

        <div className="user-details">
          <p>
            <strong>Email:</strong> {req.email}
          </p>

          <p>
            <strong>Leave:</strong> {req.leave_type}
          </p>

          <p>
            <strong>From:</strong> {req.from_date}
          </p>

          <p>
            <strong>To:</strong> {req.to_date}
          </p>

          <p>
            <strong>Reason:</strong> {req.reason}
          </p>

          <p>
            <strong>Status:</strong>{req.status}
          </p>


        </div>

        <div className="reactivation-actions">

          {req.status === "Pending" && (
            <button
              className="approve-btn"
              onClick={async () => {
                await approveLeave(req.id);

                setRequests((prev) =>
                  prev.filter((item) => item.id !== req.id)
                );

                window.dispatchEvent(
                  new Event("dashboardRefresh")
                );
              }}
            >
              Approve
            </button>
          )}

          <button
            className="reject-btn"
            onClick={async () => {
              await rejectLeave(req.id);

              setRequests((prev) =>
                prev.filter((item) => item.id !== req.id)
              );

              window.dispatchEvent(
                new Event("dashboardRefresh")
              );
            }}
          >
            Reject
          </button>

        </div>

      </div>

    ))

  )}

</div>
  );
};

export default AdminLeaveRequests;