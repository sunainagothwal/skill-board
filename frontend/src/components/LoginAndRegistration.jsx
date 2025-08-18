import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Styles.css";

const LoginAndRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameReg, setNameReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (email === "abc@gmail.com" && password === "Skillboard123@") {
      localStorage.setItem("isLoggedIn", "true");
      navigate(from, { replace: true });
    } else {
      alert("Invalid credentials");
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLogin(true);
  };

  return (
    <div className="login_background">
      {isLogin ? (
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
              onClick={() => setIsLogin(false)}
            >
              Don't have an account? Register
            </span>
          </div>
        </div>
      ) : (
        <div className="login_container">
          <h2 className="login_title">Register Here</h2>
          <form className="form_login" onSubmit={handleRegisterSubmit}>
            <div className="form_group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={nameReg}
                onChange={(e) => setNameReg(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form_group">
              <label htmlFor="emailReg">Email</label>
              <input
                id="emailReg"
                type="email"
                value={emailReg}
                onChange={(e) => setEmailReg(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form_group">
              <label htmlFor="passwordReg">Password</label>
              <input
                id="passwordReg"
                type="password"
                value={passwordReg}
                onChange={(e) => setPasswordReg(e.target.value)}
                placeholder="Create your password"
                required
              />
            </div>

            <button type="submit" className="login_button">
              Register
            </button>
          </form>

          <div className="login_links">
            <span
              style={{ cursor: "pointer", color: "#0066cc" }}
              onClick={() => setIsLogin(true)}
            >
              Back to Login
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginAndRegister;
