import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/AuthServices";
import "./forgotpassword.css";

const ForgotPassword = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    new_password: "",
    confirm_password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      formData.new_password !==
      formData.confirm_password
    ) {

      setMessage(
        "Passwords do not match"
      );

      return;
    }

    try {

      const response =
        await forgotPassword({
          email: formData.email,
          new_password:
            formData.new_password
        });

      setMessage(response.message);

      setTimeout(() => {

        navigate("/");

      }, 1500);

    } catch (error) {
  console.log(error.response?.data);

  setMessage(
    error.response?.data?.detail ||
    "Failed to update password"
  );
}
  };

  return (

    <div className="auth-container">

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <h2>
          Reset Password
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="new_password"
          placeholder="Enter New Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <button type="submit">
          Update Password
        </button>

        {message && (
          <p className="success-msg">
            {message}
          </p>
        )}

      </form>

    </div>
  );
};

export default ForgotPassword;