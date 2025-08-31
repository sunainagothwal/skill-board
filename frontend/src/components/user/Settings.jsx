import { useState } from "react";
import { usePopup } from "../../common/context/PopupContext.jsx";
import DeleteAccountPopupForm from "../auth/DeleteAccountPopupForm";

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { openPopup } = usePopup();

  //const [language, setLanguage] = useState("en");

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

      {/* <div className="settings-section">
        <h3>Language</h3>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="fr">French</option>
        </select>
      </div> */}

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
