import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = ({ profile, updateProfile }) => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(profile?.img || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [password, setPassword] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const save = () => {
    updateProfile({ img: photo, phone, email });
    alert("Profile updated (preview)");
  };

  return (
    <div className="setting_page">
      <div className="settings-container">
        <h2>Settings</h2>

        <div className="profile-row">
          <div className="photo-container">
            <img
              src={photo || "https://randomuser.me/api/portraits/women/68.jpg"}
              alt="Profile"
              className="profile-photo"
            />
            <div className="camera-icon">
              <img src="/camera-icon.svg" alt="Edit" />
            </div>
          </div>

          <div className="photo-buttons">
            <label className="upload-btn">
              Upload New
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
            </label>
            <button className="delete-btn" onClick={() => setPhoto("")}>
              Delete avatar
            </button>
          </div>
        </div>

        <div className="card form">
          <label>Change phone number</label>
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <label>Change email</label>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Change password</label>
          <input
            placeholder="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="row">
            <button className="btn" onClick={save}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
