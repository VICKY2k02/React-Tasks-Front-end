// import { useState } from "react";
// import { FaBell } from "react-icons/fa";
// import  "./Notifications.css"

// const NotificationBell = ({
//   pendingRequests,
//   recentActivities
// }) => {

//   const [open, setOpen] =
//     useState(false);

//   return (
//     <div className="notification-wrapper">

//       <button
//         className="notification-btn"
//         onClick={() => setOpen(!open)}
//       >
//         <FaBell />

//         {pendingRequests > 0 && (
//           <span className="notification-badge">
//             {pendingRequests}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="notification-dropdown">

//           <h4>
//             Notifications
//           </h4>

//           <p>
//             Pending Approvals:
//             {pendingRequests}
//           </p>

//           <hr />

//           <h5>
//             Recent Activities
//           </h5>

//           {recentActivities.length === 0 ? (
//             <p>No activities</p>
//           ) : (
//             recentActivities.map(
//               (activity, index) => (
//                 <div
//                   key={index}
//                   className="notification-item"
//                 >
//                   <strong>
//                     {activity.action}
//                   </strong>

//                   <p>
//                     {activity.related_user}
//                   </p>
//                 </div>
//               )
//             )
//           )}

//         </div>
//       )}

//     </div>
//   );
// };

// export default NotificationBell;

import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import "./Notifications.css";

const NotificationBell = ({
  pendingRequests,
  recentActivities
}) => {

  const [open, setOpen] = useState(false);

  const [count, setCount] =
    useState(pendingRequests);

  const [activities, setActivities] =
    useState(recentActivities);

  useEffect(() => {

    setCount(pendingRequests);

  }, [pendingRequests]);

  useEffect(() => {

    setActivities(recentActivities);

  }, [recentActivities]);

  const handleMarkAllRead = () => {

    setCount(0);

    setActivities([]);

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
            Pending Approvals: {count}
          </p>

          <hr />

          <h5>Recent Activities</h5>

          {activities.length === 0 ? (

            <p>No activities</p>

          ) : (

            activities.map(
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