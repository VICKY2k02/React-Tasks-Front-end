import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitReinstatementRequest } from "../services/MemberServices";
import "./ActivityTable.css";

const AccountSuspended = () => {
  const navigate = useNavigate();

  const suspendedUser = JSON.parse(
    localStorage.getItem("suspendedUser")
  );

  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("Not Submitted");

//   const handleRequest = async () => {
//   try {
//     console.log("Sending request");

//     const res =
//       await submitReinstatementRequest({
//         email: suspendedUser.email,
//         reason
//       });

//     console.log(res);
//     setStatus("Pending");
//   } catch (err) {
//     console.log(err.response?.data);
//     console.log(err);
//   }
// };

const handleRequest = async () => {
  try {
    const res = await submitReinstatementRequest({
      email: suspendedUser.email,
      reason
    });

    console.log(res);
    setStatus("Pending");
  } catch (err) {
    console.log(err.response?.data);
  }
};


  return (
    <div className="suspended-page">
      <div className="suspended-card">

        <h1>Account Suspended</h1>

        <p>
          Status: Suspended
        </p>

        <p>
          Date:
          {suspendedUser?.suspended_at}
        </p>

        <p>
          Reason:
          {suspendedUser?.reason}
        </p>

        <p>
          Suspended By:
          {suspendedUser?.suspended_by}
        </p>

        <h3>Reinstatement Request</h3>

        <textarea
          placeholder="Enter reason"
          value={reason}
          onChange={(e)=>
            setReason(e.target.value)
          }
        />

        <button onClick={handleRequest}>
          Submit Request
        </button>

        <p>
          Request Status: {status}
        </p>

        <button onClick={() => navigate("/")}>
          Back To Login
        </button>
      </div>
    </div>
  );
};

export default AccountSuspended;