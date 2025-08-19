import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useHttpClient } from "../common/hooks/http-hook";
import { useAuthContext } from "../common/context/auth-context";

const Login = ({ setShowLogin }) => {
  const { sendRequest } = useHttpClient();
  const { login, token } = useAuthContext(); // ✅ use only context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // where user came from, fallback home
  const from = location.state?.from?.pathname || "/";


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/login`,
        "POST",
        JSON.stringify({ email, password }),
        { "Content-Type": "application/json" }
      );

      if (responseData?.token) {
        // save in context
        login(responseData, responseData.token); 
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="login_container">
      <h2 className="login_title">Login Here</h2>
      <form className="form_login" onSubmit={handleLoginSubmit}>
        <div className="form_group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form_group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="login_button">
          Login
        </button>
      </form>

      <div className="login_links">
        <span
          style={{
            marginRight: "10px",
            cursor: "pointer",
            color: "#0066cc",
          }}
          onClick={() => setShowLogin(false)}
        >
          Don&apos;t have an account? Register
        </span>
      </div>
    </div>
  );
};

export default Login;
