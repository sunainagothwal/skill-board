import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../common/hooks/http-hook.js";

const ProfileView = () => {
  const { sendRequest } = useHttpClient();
  const [isEditing, setIsEditing] = useState(false);

  const [storedUser, setStoredUser] = useState({
    name: "Sunaina",
    city: "Not set",
    knows: [],
    wants: [],
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    description: "No bio provided",
    email: "abc@gmail.com",
    password: "123456789",
    phone: "",
  });

  const [editUser, setEditUser] = useState(storedUser);
  const [newTeachSkill, setNewTeachSkill] = useState("");
  const [newLearnSkill, setNewLearnSkill] = useState("");

   useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const responseData = await sendRequest(
            `${import.meta.env.VITE_APP_BACKEND_URL}/users/profile`
          );
          console.log("user profile",responseData)
        } catch (err) {
          console.error(err);
        } finally {
        console.log("fetch user profile success")  
        }
      };
  
    fetchUserProfile();
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setEditUser({ ...editUser, img: imgUrl });
    }
  };

  const addTeachSkill = () => {
    if (
      newTeachSkill.trim() !== "" &&
      !editUser.knows.includes(newTeachSkill)
    ) {
      setEditUser({
        ...editUser,
        knows: [...editUser.knows, newTeachSkill.trim()],
      });
      setNewTeachSkill("");
    }
  };

  const removeTeachSkill = (idx) => {
    setEditUser({
      ...editUser,
      knows: editUser.knows.filter((_, i) => i !== idx),
    });
  };

  const addLearnSkill = () => {
    if (
      newLearnSkill.trim() !== "" &&
      !editUser.wants.includes(newLearnSkill)
    ) {
      setEditUser({
        ...editUser,
        wants: [...editUser.wants, newLearnSkill.trim()],
      });
      setNewLearnSkill("");
    }
  };

  const removeLearnSkill = (idx) => {
    setEditUser({
      ...editUser,
      wants: editUser.wants.filter((_, i) => i !== idx),
    });
  };

  const handleSave = () => {
    setStoredUser(editUser);
    alert("Profile saved successfully!");
  };

  return (
    <div className="profile_page">
      <div>
        <h2>My Profile</h2>

        {/* Profile Image */}
        <div className="card">
          <div className="profile_img_edit_container">
            {editUser.img ? (
              <img
                src={editUser.img}
                alt="preview"
                className="profile_img_edit"
              />
            ) : (
              <div className="profile_img_edit">No Image</div>
            )}
            <label className="upload_btn">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="card">
          <h3>Basic Information</h3>
          <label>Display Name</label>
          <input
            type="text"
            name="name"
            value={editUser.name}
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            type="text"
            name="city"
            value={editUser.city}
            onChange={handleChange}
            placeholder="City, Country"
          />

          <label>Bio</label>
          <textarea
            name="description"
            value={editUser.description}
            onChange={handleChange}
            placeholder="Tell others about yourself..."
          />
        </div>

        {/* Teach Skills */}
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
            <button
              onClick={addTeachSkill}
            >
              +
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {editUser.knows.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 12px",
                  background: "#f1f3f5",
                  border: "1px solid #ccc",
                  borderRadius: "20px",
                  fontSize: "14px",
                }}
              >
                {skill}
                <button
                  onClick={() => removeTeachSkill(idx)}
                  style={{
                    background: "transparent",
                    border: "none",
                    marginLeft: "6px",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "#555",
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Learn Skills */}
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
            <button
              onClick={addLearnSkill}
            >
              +
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {editUser.wants.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 12px",
                  background: "#f1f3f5",
                  border: "1px solid #ccc",
                  borderRadius: "20px",
                  fontSize: "14px",
                }}
              >
                {skill}
                <button
                  onClick={() => removeLearnSkill(idx)}
                  style={{
                    background: "transparent",
                    border: "none",
                    marginLeft: "6px",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "#555",
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Action */}
        <div className="edit_actions">
          <button onClick={handleSave} className="save_btn">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
