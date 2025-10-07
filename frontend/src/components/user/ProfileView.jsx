import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../common/hooks/http-hook.js";

const ProfileView = () => {
  const { sendRequest } = useHttpClient();
  const [selectedFile, setSelectedFile] = useState(null);
  const [storedUser, setStoredUser] = useState({
    name: "",
    city: "",
    offeredTask: [],
    requestedTask: [],
    image: "",
    bio: "",
    email: "",
    phone: "",
  });

  const [userProfile, setUserProfile] = useState(storedUser);
  const [newTeachSkill, setNewTeachSkill] = useState("");
  const [newLearnSkill, setNewLearnSkill] = useState("");

  const parseSkills = (skills) => {
    if (!skills) return [];

    if (Array.isArray(skills)) {
      if (skills.length === 1 && typeof skills[0] === "string") {
        try {
          const parsed = JSON.parse(skills[0]);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch {
          return skills;
        }
      }
      return skills;
    }

    try {
      const parsed = JSON.parse(skills);
      return parseSkills(parsed);
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_APP_BACKEND_URL}/users/profile`
        );

        if (responseData?.profile) {
          setUserProfile({
            name: responseData.profile.name || "",
            city: responseData.profile.city || "",
            offeredTask: parseSkills(responseData.profile.offeredTask),
            requestedTask: parseSkills(responseData.profile.requestedTask),
            image: responseData.profile.image || "",
            bio: responseData.profile.bio || "",
            email: responseData.profile.email || "",
            phone: responseData.profile.phone || "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserProfile();
  }, [sendRequest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      if (userProfile.city) formData.append("city", userProfile.city);
      if (userProfile.bio) formData.append("bio", userProfile.bio);
      if (userProfile.phone) formData.append("phone", userProfile.phone);
      if (userProfile.name) formData.append("name", userProfile.name);
      if (selectedFile) formData.append("image", selectedFile);

      formData.append(
        "offeredTask",
        JSON.stringify(userProfile.offeredTask || [])
      );
      formData.append(
        "requestedTask",
        JSON.stringify(userProfile.requestedTask || [])
      );

      const updatedProfile = await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/updateUser`,
        "PATCH",
        formData
      );

      const safeUpdated = {
        ...updatedProfile,
        offeredTask: parseSkills(updatedProfile.offeredTask),
        requestedTask: parseSkills(updatedProfile.requestedTask),
      };

      setStoredUser(safeUpdated);
      setUserProfile(safeUpdated);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  const addTeachSkill = () => {
    if (
      newTeachSkill.trim() !== "" &&
      !userProfile.offeredTask.includes(newTeachSkill)
    ) {
      setUserProfile((prev) => ({
        ...prev,
        offeredTask: [...prev.offeredTask, newTeachSkill.trim()],
      }));
      setNewTeachSkill("");
    }
  };

  const removeTeachSkill = (idx) => {
    setUserProfile((prev) => ({
      ...prev,
      offeredTask: prev.offeredTask.filter((_, i) => i !== idx),
    }));
  };

  const addLearnSkill = () => {
    if (
      newLearnSkill.trim() !== "" &&
      !userProfile.requestedTask.includes(newLearnSkill)
    ) {
      setUserProfile((prev) => ({
        ...prev,
        requestedTask: [...prev.requestedTask, newLearnSkill.trim()],
      }));
      setNewLearnSkill("");
    }
  };

  const removeLearnSkill = (idx) => {
    setUserProfile((prev) => ({
      ...prev,
      requestedTask: prev.requestedTask.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="profile_page">
      <div>
        <h2>My Profile</h2>

        <div className="card">
          <div className="profile_img_edit_container">
            {userProfile.image ? (
              <img
                src={
                  userProfile.image && userProfile.image.startsWith("data:")
                    ? userProfile.image
                    : `${import.meta.env.VITE_APP_ASSET_URL}/${
                        userProfile.image
                      }`
                }
                alt="preview"
                className="profile_img_edit"
              />
            ) : (
              <div className="profile_img_edit">No Image</div>
            )}
            <label className="upload_btn">
              <img
                src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
                alt="Camera Icon"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div className="card">
          <h3>Basic Information</h3>
          <label>Display Name</label>
          <input
            type="text"
            name="name"
            value={userProfile.name || ""}
            onChange={handleChange}
          />
          <label>Location</label>
          <input
            type="text"
            name="city"
            value={userProfile.city || ""}
            onChange={handleChange}
            placeholder="City, Country"
          />
          <label>Bio</label>
          <textarea
            name="bio"
            value={userProfile.bio || ""}
            onChange={handleChange}
            placeholder="Tell others about yourself..."
          />
        </div>

        <div className="card">
          <h3>Skills I Can Teach</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              type="text"
              value={newTeachSkill}
              onChange={(e) => setNewTeachSkill(e.target.value)}
              placeholder="Add a skill you can teach..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <button className="add-btn" onClick={addTeachSkill}>
              +
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {(userProfile.offeredTask || []).map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
                <button
                  onClick={() => removeTeachSkill(idx)}
                  className="remove-btn"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Skills I Want to Learn</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              type="text"
              value={newLearnSkill}
              onChange={(e) => setNewLearnSkill(e.target.value)}
              placeholder="Add a skill you want to learn..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <button className="add-btn" onClick={addLearnSkill}>
              +
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {(userProfile.requestedTask || []).map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
                <button
                  onClick={() => removeLearnSkill(idx)}
                  className="remove-btn"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="edit_actions">
          <button onClick={handleUpdateProfile} className="save_btn">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
