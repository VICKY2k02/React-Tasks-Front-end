import { useEffect, useState } from "react";
import axios from "axios";

const ReactivationRequests = () => {

  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {

    const response = await axios.get(
      "http://127.0.0.1:8000/reactivation-requests"
    );

    setRequests(response.data);
  };

  useEffect(() => {

    loadRequests();

  }, []);

  const approveRequest = async (email) => {

    await axios.put(
      `http://127.0.0.1:8000/reactivation/${email}/approve`
    );

    loadRequests();
  };

  window.dispatchEvent(
    new Event("dashboardRefresh")
  );

  const rejectRequest = async (email) => {

    await axios.put(
      `http://127.0.0.1:8000/reactivation/${email}/reject`
    );

    loadRequests();
  };

  return (
  <div className="reactivation-container">

    {requests.length === 0 ? (

      <p className="no-requests">
        No Reactivation Requests Found
      </p>

    ) : (

      requests.map((req) => (

        <div
          key={req.email}
          className="reactivation-card"
        >

          <div className="user-details">

            <p>
              <strong>Email:</strong>
              {req.email}
            </p>

            <p>
              <strong>Status:</strong>
              
                {req.status}
              
            </p>

          </div>

          <div className="reactivation-actions">

            {req.status === "Pending" && (

              <button
                className="approve-btn"
                onClick={() =>
                  approveRequest(req.email)
                }
              >
                Approve
              </button>

            )}

            <button
              className="reject-btn"
              onClick={() =>
                rejectRequest(req.email)
              }
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

export default ReactivationRequests;