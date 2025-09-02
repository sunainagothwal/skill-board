import { useState, useEffect } from "react";
import { usePopup } from "../../common/context/PopupContext.jsx";
import DeleteAccountPopupForm from "../auth/DeleteAccountPopupForm";

const darkStyleId = "darkify-style";

function applyDarkMode(enable) {
  if (enable) {
    if (!document.getElementById(darkStyleId)) {
      const style = document.createElement("style");
      style.id = darkStyleId;
      style.textContent = `
        html {
          filter: invert(1) hue-rotate(180deg) !important;
          background: #121212 !important;
        }
        img, video, iframe {
          filter: invert(1) hue-rotate(180deg) !important;
        }
      `;
      document.head.appendChild(style);
    }
  } else {
    const existing = document.getElementById(darkStyleId);
    if (existing) existing.remove();
  }
}

function Settings() {
  // ✅ Initialize state from localStorage
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [notifications, setNotifications] = useState(true);
  const { openPopup } = usePopup();

  // Apply dark mode when state changes
  useEffect(() => {
    applyDarkMode(darkMode);
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
  }, [darkMode]);

  const handleDelete = () => {
    openPopup("DeleteAccountPopup", {
      title: "Delete Account",
      body: <DeleteAccountPopupForm />,
    });
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-section">
        <h3>Appearance</h3>
        <label className="settings-option">
          Enable Dark Mode
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </div>
        </label>
      </div>

      <div className="settings-section">
        <h3>Notifications</h3>
        <label className="settings-option">
          Enable Email Notifications
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider"></span>
          </div>
        </label>
      </div>

      <div className="settings-section">
        <h3>Account</h3>
        <label className="settings-option">
          Manage your account settings
          <button className="delete-btn" onClick={handleDelete}>
            Delete Account
          </button>
        </label>
      </div>
    </div>
  );
}

export default Settings;
