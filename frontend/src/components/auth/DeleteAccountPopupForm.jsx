import React, { useState } from "react";
import { useHttpClient } from "../../common/hooks/http-hook";
import { usePopup } from "../../common/context/PopupContext";
import { showSuccess, showError } from "../../common/toastHelper";
import { useNavigate } from "react-router-dom";

const DeleteAccountPopupForm = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { sendRequest } = useHttpClient();
  const { closePopup } = usePopup();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      const responseData= await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/delete-account`,
        "DELETE",
        JSON.stringify({
          password
        }),
        { "Content-Type": "application/json" }
      );
     if (responseData) {
      closePopup()
      navigate("/login");
      showSuccess("Your account has been deleted successfully");
     } 
     
    } catch (err) {
      showError(err.message||"Failed to delete account. Please try again.");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          This action is{" "}
          <span className="text-red-500 font-semibold">permanent </span>
          and cannot be undone. Please confirm your email and password.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          placeholder="Enter your password"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-black-400"
        />

        {error && <p className="text-blue-500 text-xs mt-1">{error}</p>}
      </div>

      <div className="flex justify-end gap-2 px-4 py-3 border-t mt-10">
        <button
          onClick={closePopup}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 border rounded-md bg-blue-500 text-white  hover:bg-blue-600"
        >
          Delete Account
        </button>
      </div>
    </>
  );
};

export default DeleteAccountPopupForm;
