import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import "./Notifications.css";
import { markAllRead } from "../../services/MemberServices";

const NotificationBell = ({
  pendingRequests,
  recentActivities,
  reactivationRequests
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
                  key={req.email}
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

