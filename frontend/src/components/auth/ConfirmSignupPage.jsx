import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../common/hooks/http-hook.js";
import { showSuccess, showError } from "../../common/toastHelper";

const ConfirmSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Get token from query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    const confirmSignup = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_APP_BACKEND_URL}/users/confirm-signup-email/${token}`
        );

        if (responseData) {
          setMessage("🎉 Your account has been successfully confirmed!");
          showSuccess("Account confirmed! Redirecting to login...");
          setSuccess(true);

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        setMessage("❌ Confirmation failed. Please try again or contact support.");
        showError(error.message || "Something went wrong, please try again.");
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) confirmSignup();
  }, [sendRequest, token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Confirming your account...</p>
          </>
        ) : (
          <>
            <h2
              className={`text-2xl font-bold mb-4 ${
                success ? "text-green-600" : "text-red-600"
              }`}
            >
              {success ? "Success!" : "Oops!"}
            </h2>
            <p className="text-gray-700 text-lg mb-4">{message}</p>
            {success && (
              <p className="text-gray-500 text-sm">
                Redirecting to login page in 3 seconds...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmSignupPage;
