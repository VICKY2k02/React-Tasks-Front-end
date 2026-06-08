import { useState } from "react";
import { FaBell } from "react-icons/fa";
import  "./Notifications.css"

const NotificationBell = ({
  pendingRequests,
  recentActivities
}) => {

  const [open, setOpen] =
    useState(false);

  return (
    <div className="notification-wrapper">

      <button
        className="notification-btn"
        onClick={() => setOpen(!open)}
      >
        <FaBell />

        {pendingRequests > 0 && (
          <span className="notification-badge">
            {pendingRequests}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">

          <h4>
            Notifications
          </h4>

          <p>
            Pending Approvals:
            {pendingRequests}
          </p>

          <hr />

          <h5>
            Recent Activities
          </h5>

          {recentActivities.length === 0 ? (
            <p>No activities</p>
          ) : (
            recentActivities.map(
              (activity, index) => (
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
              )
            )
          )}

        </div>
      )}

    </div>
  );
};

export default NotificationBell;