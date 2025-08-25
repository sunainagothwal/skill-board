import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../../common/hooks/http-hook.js";
import { useAuth } from "../../common/hooks/auth-hook.js";

const Signup = ({ setShowLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { sendRequest } = useHttpClient();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/signup`,
        "POST",
        JSON.stringify({
          name,
          email,
          password,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      if (responseData) {
        auth.login(responseData, responseData.token);
        navigate("/");
        //showSuccess("Signed up successfully, please login using credentials");
        //setShowLogin(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login_container">
      <h2 className="login_title">Register Here</h2>
      <form className="form_login" onSubmit={handleRegisterSubmit}>
        <div className="form_group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form_group">
          <label htmlFor="emailReg">Email</label>
          <input
            id="emailReg"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form_group">
          <label htmlFor="passwordReg">Password</label>
          <input
            id="passwordReg"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          onClick={() => setShowLogin(true)}
        >
          Back to Login
        </span>
      </div>

    </div>
  );
};

export default Signup;
