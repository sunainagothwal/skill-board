import React, { useState } from "react";
import { useHttpClient } from "../../common/hooks/http-hook.js";
import { showSuccess } from "../../common/toastHelper";

const Signup = ({ setShowLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { sendRequest } = useHttpClient();
  

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/signup`,
        "POST",
        JSON.stringify({ name, email, password }),
        { "Content-Type": "application/json" }
      );

      if (responseData) {
         showSuccess("Signup successful! A confirmation email has been sent.");
         setShowLogin(true)
       }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl 
                  bg-white p-12 rounded-lg border border-gray-200 shadow-card">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">
          Create Your Account
        </h2>

        <form onSubmit={handleRegisterSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="emailReg" className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              id="emailReg"
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
            <label htmlFor="passwordReg" className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              id="passwordReg"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create your password"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 
                         focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
                       hover:bg-blue-700 transition text-lg"
          >
            Register
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => setShowLogin(true)}
          >
            Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
