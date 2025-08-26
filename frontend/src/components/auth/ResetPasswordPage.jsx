import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../common/hooks/http-hook";
import { showSuccess, showError } from "../../common/toastHelper";

const EyeIcon = ({ open }) => (
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.51 10.51 0 0 1 12 20c-7 0-11-8-11-8a18.51 18.51 0 0 1 6.55-5.32"></path>
      <path d="M2 2l20 20"></path>
      <path d="M21 12c-1 4-6 8-11 8a12.92 12.92 0 0 1-2.91-.95"></path>
      <path d="M15.46 15.46a3.5 3.5 0 0 1-5.01-5.01"></path>
      <path d="M9.45 4.95A10.51 10.51 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-6.55 5.32"></path>
    </svg>
  )
);

const ResetPasswordPage = () => {
  const { token } = useParams();
  const { sendRequest } = useHttpClient();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/new-password`,
        "POST",
        JSON.stringify({ token, newPassword: password }),
        { "Content-Type": "application/json" }
      );
      showSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      showError(err.message || "Invalid or expired token.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">Reset Password</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-600 custom_input_label">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
          />
          <span
            className="absolute right-3 top-[35px] text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(prev => !prev)}
          >
            <EyeIcon open={showPassword} />
          </span>
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-600 custom_input_label">Confirm New Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
          />
          <span
            className="absolute right-3 top-[35px] text-gray-500 cursor-pointer"
            onClick={() => setShowConfirmPassword(prev => !prev)}
          >
            <EyeIcon open={showConfirmPassword} />
          </span>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
