import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { submitLeave, getMyLeaves } from "../services/LeaveServicce";
import "./AttendanceRequest.css"

const Leave = () => {
  const { user } = useContext(AuthContext);

  const [leaves, setLeaves] = useState([]);

  const [form, setForm] = useState({
    leave_type: "",
    from_date: "",
    to_date: "",
    reason: ""
  });

  const loadLeaves = async () => {
    const res = await getMyLeaves(user.email);
    setLeaves(res.data);
  };

  useEffect(() => {
    loadLeaves();
  }, []);

const handleSubmit = async () => {
  try {

    await submitLeave({
      email:user.email,
      ...form
    });

    window.dispatchEvent(
        new Event("dashboardRefresh")
    );

    alert("Leave submitted");

    setForm({
      leave_type:"",
      from_date:"",
      to_date:"",
      reason:""
    });

    loadLeaves();

  } catch(err){

    console.log(err);

    alert("Leave submit failed");

  }
};

  return (
    <div className="leave-action">
  <h1>Leave Management</h1>

  <div className="leave-form">
    <select
    value={form.leave_type}
      onChange={(e) =>
        setForm({
          ...form,
          leave_type: e.target.value,
        })
      }
    >
      <option>Sick Leave</option>
      <option>Casual Leave</option>
    </select>

    <input
      type="date"
      onChange={(e) =>
        setForm({
          ...form,
          from_date: e.target.value,
        })
      }
    />

    <input
      type="date"
      onChange={(e) =>
        setForm({
          ...form,
          to_date: e.target.value,
        })
      }
    />

    <textarea
      placeholder="Reason"
      onChange={(e) =>
        setForm({
          ...form,
          reason: e.target.value,
        })
      }
    />

    <button
      className="submit-btn"
      onClick={handleSubmit}
    >
      Submit Leave
    </button>
  </div>

  <div className="leave-history">
    <h2>My Leave Requests</h2>

    {leaves.map((leave) => (
      <div key={leave.id} className="leave-item">
        <span>
          {leave.leave_type} | {leave.from_date} - {leave.to_date}
        </span>

        <div
          className={`leave-status ${leave.status.toLowerCase()}`}
        >
          {leave.status}
        </div>
      </div>
    ))}
  </div>
</div>
  );
};

export default Leave;