import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useHttpClient } from "../../common/hooks/http-hook.js";
import { useAuthContext } from "../../common/context/auth-context.jsx";
import { usePopup } from "../../common/context/PopupContext.jsx";
import ResetPwdPopupForm from "./ResetPwdPopupForm";

const Login = ({ setShowLogin }) => {
  const { sendRequest } = useHttpClient();
  const { login } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { openPopup } = usePopup();
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
        login(responseData, responseData.token);
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

   const handleResetClick = () => {
    openPopup("pwdResetPopup", {
      title: "Reset Password",
      body: <ResetPwdPopupForm />,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl 
                  bg-white p-10 rounded-lg border border-gray-200 shadow-card"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">
          Login to Your Account
        </h2>

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
                       hover:bg-blue-700 transition text-lg"
          >
            Login
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-3">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() => setShowLogin(false)}
            >
              Register
            </span>
          </p>
          <p>
            Forgot Password?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={handleResetClick}
            >
              Click Here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
