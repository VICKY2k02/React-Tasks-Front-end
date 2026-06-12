import { useState } from "react";
import { submitReactivation }
from "../../services/MemberServices";
import "./Members.css"

const AccountDeactivated = () => {

  const email =
    localStorage.getItem(
      "deactivatedUser"
    );


   const [reason,setReason] =
 useState("");

 const [submitted, setSubmitted] = useState(false);

const handleSubmit = async () => {

  console.log(
    "Email:",
    localStorage.getItem("deactivatedUser")
  );

  console.log(
    "Reason:",
    reason
  );

  const response =
    await submitReactivation({
      email:
      localStorage.getItem(
        "deactivatedUser"
      ),
      reason
    });

    window.dispatchEvent(
      new Event("dashboardRefresh")
    );

    setSubmitted(true);

  // console.log(response);
};
  return (

    <div className="deactivated-wrapper">

      <div className="deactivated-card">

        <div className="icon">
          🚫
        </div>

        <h1>
          Account Deactivated
        </h1>

        <p>
          Your account ({email})
          has been deactivated by
          an administrator.
        </p>

        
  {
   submitted
   ? (
      <h3>
       Request Submitted
      </h3>
     )
   : (
    <>
     <textarea
      value={reason}
      onChange={(e)=>
      setReason(
       e.target.value
      )}
     />

     <button
      className="reactivate-btn"
      onClick={
       handleSubmit
      }
     >
      Request Reactivation
     </button>
    </>
   )
  }

        <button
          className="pending-btn"
        >
          Pending Review
        </button>

        <button
          className="logout-btn"
          onClick={() => {

            localStorage.clear();

            window.location.href =
              "/";
          }}
        >
          Log out
        </button>

      </div>

    </div>
  );
};

export default AccountDeactivated;