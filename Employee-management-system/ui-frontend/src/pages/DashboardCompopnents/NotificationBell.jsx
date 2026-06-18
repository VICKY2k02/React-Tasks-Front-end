import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import "./Notifications.css";
import { markAllRead } from "../../services/MemberServices";
import axios from "axios";

const NotificationBell = ({
  pendingRequests,
  leaveRequests=[],
  recentActivities,
  reactivationRequests,
  attendanceRequests = [], 
  onApprove,
  onReject
}) => {

  const [open, setOpen] = useState(false);

  const [count, setCount] = useState(pendingRequests);


  useEffect(() => {

    setCount(pendingRequests);

  }, [pendingRequests]);


  const handleMarkAllRead = async () => {

    await markAllRead();

    setCount(0);


  };

const approveAttendance = async (email) => {
  try {
    await axios.put(
      `http://127.0.0.1:8000/attendance/approve/${email}`
    );

    window.dispatchEvent(
      new Event("dashboardRefresh")
    );

  } catch (err) {
    console.error(err);
  }
};

const rejectAttendance = async (email) => {
  try {
    await axios.put(
      `http://127.0.0.1:8000/attendance/reject/${email}`
    );

    window.dispatchEvent(
      new Event("dashboardRefresh")
    );

  } catch (err) {
    console.error(err);
  }
};


  return (

    <div className="notification-wrapper">

      <button
        className="notification-btn"
        onClick={() => setOpen(!open)}
      >
        <FaBell />

        {count > 0 && (
          <span className="notification-badge">
            {count}
          </span>
        )}
      </button>

      {open && (

        <div className="notification-dropdown">

          <div className="notification-header">

            <h4>Notifications</h4>

            <button
              className="mark-read-btn"
              onClick={handleMarkAllRead}
            >
              Mark All Read
            </button>

          </div>
          <p>
            Pending Approvals: {pendingRequests}
          </p>

          <hr />

          <h5>Reactivation Requests</h5>

          {
            reactivationRequests?.length > 0 ? (

              reactivationRequests.map((req) => (

                <div
                  key={req.email }
                  className="notification-item"
                >
                  <strong>
                    {req.email}
                  </strong>

                  <p>
                    Message:  {req.reason}
                  </p>

                  <p>
                    Status: {req.status}
                  </p>

                </div>

              ))

            ) : (

              <p>No Requests</p>

            )
          }


          <hr/>

          <h5>Leave Requests</h5>

          {
          leaveRequests.length>0 ? (

          leaveRequests.map((req)=>(

          <div
          key={req.id}
          className="notification-item"
          >

          <strong>
          {req.email}
          </strong>

          <p>
          {req.leave_type}
          </p>

          <p>
          {req.from_date}
          </p>

          <p>
          {req.to_date}
          </p>

          <p>
          {req.reason}
          </p>

          </div>

          ))

          ):(

          <p>No Leave Requests</p>

          )
          }


        <hr />
                      {/* ATTENDANCE REQUESTS */}
                  {/* ========================= */}
        <div className="attendance-container">
          <h5>Attendance Requests</h5>

          {attendanceRequests.length > 0 ? (
            attendanceRequests.map((req, index) => (
              <div key={index} className="notification-item">
                <strong>{req.user_name}</strong>
                <p>{req.user_email}</p>
                <p>{req.timestamp}</p>
                <p>Status: {req.status}</p>

                {req.status === "Pending" && (
                  <div>
                    <button onClick={() => approveAttendance(req.user_email)}>
                      Approve
                    </button>

                    <button onClick={() => rejectAttendance(req.user_email)}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No Requests</p>
          )}
        </div>
                  {/* <hr />

          <h5>Recent Activities</h5>

          {
            activities.length === 0 ? (

              <p>No Activities</p>

            ) : (

              activities.map((activity, index) => (

                <div
                  key={index}
                  className="notification-item"
                >
                  <strong>
                    {activity.action}
                  </strong>

                  <p>
                    {activity.related_user}
                  </p>

                </div>

              ))

            )
          } */}




        </div>

      )}

    </div>

  );
};

export default NotificationBell;

