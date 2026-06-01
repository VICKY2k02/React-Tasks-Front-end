import {useState} from "react";
import {signupUser}from "../services/AuthServices";
import "./forgotpassword.css"
import { useNavigate } from "react-router-dom";
const Signup = () => {

  const [formData,setFormData] =
  useState({
    email:"",
    password:"",
    confirmPassword: "",
    role:"user"
  });

  const [errors, setErrors] = useState({});

  // const handleChange=(e)=>{
  //   setFormData({
  //     ...formData,
  //     [e.target.name]:
  //     e.target.value
  //   });
  // };

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value,
  });

  setErrors({
    ...errors,
    [name]: "",
  });
};

  const [message, setMessage] = useState("");

  

  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  
  if (
    formData.password !==
    formData.confirmPassword
  ) {
    alert("Passwords do not match");
    return;
  }

  try {

    await signupUser({
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    alert("Signup Successful");

    navigate("/");

  } catch (error) {

  if (
    error.response?.data?.detail ===
    "User already has an account"
  ) {

    setMessage(
      "User already has an account. Please login."
    );

    setTimeout(() => {
      navigate("/");
    }, 2000);

  } else {

    setMessage("Signup Failed");

  }
}
};

return (
  <div className="signup-container">
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Signup</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <input
      type="password"
      name="confirmPassword"
      placeholder="Confirm Password"
      onChange={handleChange}
      required
/>        
      {message && (
  <div className="message-box">
    {message}
  </div>
)}

      <select
        name="role"
        onChange={handleChange}
        required
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">
        Signup
      </button>
    </form>
  </div>
);
}
export default Signup;