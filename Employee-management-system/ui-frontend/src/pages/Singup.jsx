import {useState, useEffect} from "react";
import {signupUser}from "../services/AuthServices";
import "./forgotpassword.css"
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCallback } from "react";


const Signup = () => {

  const [formData,setFormData] =
  useState({
    email:"",
    password:"",
    confirmPassword: "",
    role:"user",
    company_id: 1
  });
  const { token } = useParams();
  const [errors, setErrors] = useState({});
  
  const [inviteData, setInviteData] = useState(null);

  useEffect(() => {

  if(token){

    loadInvitation();

  }

}, [token]);

 

const loadInvitation = useCallback(async () => {

  const response = await axios.get(
    `http://127.0.0.1:8000/invite/${token}`
  );

  setFormData(prev => ({
    ...prev,
    email: response.data.email,
    role: response.data.role,
    company_id: response.data.company_id
  }));

}, [token]);

useEffect(() => {

  if (token) {
    loadInvitation();
  }

}, [token, loadInvitation]);
 
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
      role: formData.role,
      company_id: Number(formData.company_id)
    });

    alert("Signup Successful");

    navigate("/");

  } catch (error) {

  if (error.response?.data?.detail) {

  alert(error.response.data.detail);

  setMessage(
    error.response.data.detail
  );

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
        value={formData.email}
        onChange={handleChange}
        disabled={!!token}
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
        value={formData.role}
        onChange={handleChange}
        disabled={!!token}
        required
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <select
        name="company_id"
        value={formData.role}
        onChange={handleChange}
        disabled={!!token}
      >
        <option value="1">
          Company A
        </option>

        <option value="2">
          Company B
        </option>
      </select>

      <button type="submit">
        Signup
      </button>
    </form>
  </div>
);
}
export default Signup;