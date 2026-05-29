import {FaEye, FaEyeSlash, FaEnvelope, FaLock} from "react-icons/fa";

import {useState, useContext} from "react";

import {useNavigate} from "react-router-dom";

import {loginUser} from "../services/AuthServices";

import {AuthContext} from "../context/AuthContext";


const Login = () => {

  const navigate = useNavigate();

  const { login } =
    useContext(AuthContext);

  const [showPassword,
    setShowPassword] = useState(false);

  const [formData,
    setFormData] = useState({
      email: "",
      password: ""
    });

  const [error,
    setError] = useState("");

  const [loading,
    setLoading] = useState(false);

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

    try {

      const response =
        await loginUser(formData);

      login(response);

      navigate("/dashboard");

    } catch (err) {

      setError(
        "Invalid Email or Password"
      );

    } finally {

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

        <button
          type="submit"
        >

          {
            loading
              ? "Logging in..."
              : "Login"
          }

        </button>

      </form>

    </div>
  );
};

export default Login;