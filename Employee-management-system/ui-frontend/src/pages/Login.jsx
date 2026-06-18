import {FaEye, FaEyeSlash, FaEnvelope, FaLock} from "react-icons/fa";

import {useState, useContext} from "react";

import {useNavigate} from "react-router-dom";

import {loginUser} from "../services/AuthServices";

import {AuthContext} from "../context/AuthContext";


const Login = () => {

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({email: "", password: ""});

  const [error, setError] = useState("");

  const [loading,setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });
  };

const handleLogin = async (e) => {

  e.preventDefault();

  setLoading(true);
  setError("");


  try {

  const response = await loginUser(formData);

if (response.status === "deactivated") {

  localStorage.setItem(
    "deactivatedUser",
    response.email
  );

  navigate("/account-deactivated");

  return;
}

  localStorage.setItem(
    "email",
    response.email
  );

  localStorage.setItem(
    "token",
    response.token
  );

  localStorage.setItem(
    "company_id",
    response.company_id
  );

  login(response);

  setFormData({
    email: "",
    password: ""
  });

  navigate("/dashboard");

} catch (err) {

  setError(
    err.response?.data?.detail ||
    "Invalid Email or Password"
  );

}


finally {

    setLoading(false);

  }

};



  return (

    <div className="login-container">

      <form
        className="login-form"
        onSubmit={handleLogin}
      >

        <h2>
          Welcome Back
        </h2>

        <p>
          Login to your account
        </p>

        {
          error && (
            <div className="error-box">
              {error}
            </div>
          )
        }

          <div className="input-box">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* Password Box */}
          <div className="password-box">

            <FaLock className="input-icon" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              className="eye-icon"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >

              {
                showPassword
                  ? <FaEyeSlash />
                  : <FaEye />
              }

            </span>

          </div>

                  <p
          className="forgot-link"
          onClick={() =>
            navigate("/forgot-password")
          }
        >
          Forgot Password?
        </p>

        <button
          type="submit"
        >

          {
            loading
              ? "Logging in..."
              : "Login"
          }

        </button>


          <p
            className="forgot-link"
            onClick={() =>
            navigate("/signup")
            }
          >
            Sign-Up
          </p>



      </form>

    </div>
  );
};

export default Login;