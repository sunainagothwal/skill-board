import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../common/hooks/http-hook.js";
import { showSuccess, showError } from "../../common/toastHelper";

const ProfileView = () => {
  const { sendRequest } = useHttpClient();
  const [isEditing, setIsEditing] = useState(false);

  const [storedUser, setStoredUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const [newTeachSkill, setNewTeachSkill] = useState("");
  const [newLearnSkill, setNewLearnSkill] = useState("");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_APP_BACKEND_URL}/users/profile`
        );

        const p = responseData.profile;

        const mappedUser = {
          name: p.name || "",
          email: p.email || "",
          city: p.city || "Not set",
          description: p.bio || "No bio provided",
          phone: p.phone || "",
          knows: p.offeredTask || [],
          wants: p.requestedTask || [],
          img: p.image
            ? `${import.meta.env.VITE_APP_ASSET_URL}/${p.image}`
            : "",
          imageFile: null,
        };

        setStoredUser(mappedUser);
        setEditUser(mappedUser);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserProfile();
  }, []);

  if (!storedUser || !editUser) {
    return <p>Loading profile...</p>;
  }

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditUser((prev) => ({
        ...prev,
        imageFile: file,
        img: URL.createObjectURL(file),
      }));
    }
  };

  const addTeachSkill = () => {
    if (!newTeachSkill.trim()) return;
    setEditUser((prev) => ({
      ...prev,
      knows: [...prev.knows, newTeachSkill.trim()],
    }));
    setNewTeachSkill("");
  };

  const addLearnSkill = () => {
    if (!newLearnSkill.trim()) return;
    setEditUser((prev) => ({
      ...prev,
      wants: [...prev.wants, newLearnSkill.trim()],
    }));
    setNewLearnSkill("");
  };

  const handleTeachKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTeachSkill();
    }
  };

  const handleLearnKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLearnSkill();
    }
  };

  const removeTeachSkill = (idx) => {
    setEditUser((prev) => ({
      ...prev,
      knows: prev.knows.filter((_, i) => i !== idx),
    }));
  };

  const removeLearnSkill = (idx) => {
    setEditUser((prev) => ({
      ...prev,
      wants: prev.wants.filter((_, i) => i !== idx),
    }));
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editUser.name);
      formData.append("city", editUser.city);
      formData.append("bio", editUser.description);
      formData.append("phone", editUser.phone);

      editUser.knows.forEach((s) => formData.append("offeredTask", s));
      editUser.wants.forEach((s) => formData.append("requestedTask", s));

      if (editUser.imageFile) {
        formData.append("image", editUser.imageFile);
      }

      const response = await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/users/updateUser`,
        "PATCH",
        formData
      );

      setStoredUser({
        ...editUser,
        img: response.image
          ? `${import.meta.env.VITE_APP_ASSET_URL}/${response.image}`
          : editUser.img,
      });

      setIsEditing(false);
      if(response){
         showSuccess("profile updated successfully");
      }
    } catch (err) {
      showError(err.message || "Profile update failed, please try again.");
      console.error("Profile update failed", err);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="profile_page">
      {!isEditing ? (
        <>
          {/* HEADER */}
          <div className="header_row profile_header">
            <div className="profile_img_container profile_img_wrapper">
              {storedUser.img ? (
                <img
                  src={storedUser.img}
                  alt={storedUser.name}
                  className="profile_img"
                />
              ) : (
                <div className="profile_img_placeholder">No Image</div>
              )}
            </div>
            <div className="profile_basic_info profile_info">
              <h2 className="profile_name">{storedUser.name}</h2>
              <p className="profile_email">📧 {storedUser.email}</p>
              <p className="profile_city">📍 {storedUser.city}</p>
            </div>
            <button
              className="edit_button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>

          {/* ABOUT ME */}
          <div className="card profile_about">
            <h3>About Me</h3>
            <p>{storedUser.description}</p>
          </div>

          {/* SKILLS I CAN TEACH */}
          <div className="card profile_skills">
            <h3>Skills I Can Teach</h3>
            <div className="skill_chips">
              {storedUser.knows.length > 0 ? (
                storedUser.knows.map((s, i) => (
                  <span key={i} className="chip teach">
                    {s}
                  </span>
                ))
              ) : (
                <p className="empty">No skills added</p>
              )}
            </div>
          </div>

          {/* SKILLS I WANT TO LEARN */}
          <div className="card profile_skills">
            <h3>Skills I Want to Learn</h3>
            <div className="skill_chips">
              {storedUser.wants.length > 0 ? (
                storedUser.wants.map((s, i) => (
                  <span key={i} className="chip learn">
                    {s}
                  </span>
                ))
              ) : (
                <p className="empty">No skills added</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <h2>Edit Profile</h2>

          {/* PROFILE IMAGE */}
          <div className="card profile_img_edit_container">
            {editUser.img ? (
              <img
                src={editUser.img}
                alt="preview"
                className="profile_img_edit"
              />
            ) : (
              <div className="profile_img_placeholder">No Image</div>
            )}
            <label className="upload_btn">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              Change Profile Picture
            </label>
          </div>

          {/* BASIC INFO */}
          <div className="card">
            <h3>Basic Information</h3>

            <label>Display Name</label>
            <input name="name" value={editUser.name} onChange={handleChange} />

            <label>Email</label>
            <input value={editUser.email} disabled />

            <label>City</label>
            <input name="city" value={editUser.city} onChange={handleChange} />

            <label>Bio</label>
            <textarea
              name="description"
              value={editUser.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* TEACH SKILLS */}
          <div className="card">
            <h3>Skills I Can Teach</h3>
            <div className="skill_input">
              <input
                value={newTeachSkill}
                onChange={(e) => setNewTeachSkill(e.target.value)}
                onKeyDown={handleTeachKey}
                placeholder="Add a skill"
              />
              <button className="add_btn" onClick={addTeachSkill}>
                +
              </button>
            </div>
            <div className="skill_chips">
              {editUser.knows.map((s, i) => (
                <span key={i} className="chip teach">
                  {s}
                  <button onClick={() => removeTeachSkill(i)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          {/* LEARN SKILLS */}
          <div className="card">
            <h3>Skills I Want to Learn</h3>
            <div className="skill_input">
              <input
                value={newLearnSkill}
                onChange={(e) => setNewLearnSkill(e.target.value)}
                onKeyDown={handleLearnKey}
                placeholder="Add a skill"
              />
              <button className="add_btn" onClick={addLearnSkill}>
                +
              </button>
            </div>
            <div className="skill_chips">
              {editUser.wants.map((s, i) => (
                <span key={i} className="chip learn">
                  {s}
                  <button onClick={() => removeLearnSkill(i)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="edit_actions">
            <button className="cancel_btn" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button className="save_btn" onClick={handleSave}>
              Save Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileView;
