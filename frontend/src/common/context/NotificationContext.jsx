/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import { toast } from "react-hot-toast";

// Create Context
const NotificationContext = createContext();

// Custom Hook to Use Context
export const useNotification = () => useContext(NotificationContext);

// Provider Component
export const NotificationProvider = ({ children }) => {
/*   // Show Success Message
  const showSuccess = (message) => toast.success(message);

  // Show Error Message
  const showError = (message) => toast.error(message);
 */
const getToastStyle = () => ({
  width:
    window.innerWidth < 600 ? "95%" : window.innerWidth < 1200 ? "80%" : "100%",
  maxWidth: "500px",
  margin: "0 auto",
  textAlign: "center",
});
const showSuccess = (message) => {
  toast.dismiss(); // Dismiss any existing notification
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    style: getToastStyle(),
  });
};

const showError = (message) => {
  toast.dismiss(); // Dismiss any existing notification
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    style: getToastStyle(),
  });
};
  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      {children}
    </NotificationContext.Provider>
  );
};
