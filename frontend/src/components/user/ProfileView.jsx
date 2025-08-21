import React, { useState } from "react";

const ProfileView = () => {
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

  const handleDeleteImage = () => {
    setEditUser({ ...editUser, img: "" });
  };

  const addTeachSkill = () => {
    if (newTeachSkill.trim() !== "") {
      setEditUser({
        ...editUser,
        knows: [...editUser.knows, newTeachSkill.trim()],
      });
      setNewTeachSkill("");
    }
  };

  const addLearnSkill = () => {
    if (newLearnSkill.trim() !== "") {
      setEditUser({
        ...editUser,
        wants: [...editUser.wants, newLearnSkill.trim()],
      });
      setNewLearnSkill("");
    }
  };

  const handleSave = () => {
    setStoredUser(editUser);
    setIsEditing(false);
  };

  return (
    <div className="profile_page">
      {!isEditing ? (
        <div>
          <div className="header_row">
            <h2>My Profile</h2>
            <button className="edit_button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>

          <div className="card">
            <h3>Profile Information</h3>
            <div className="profile_info_row">
              <div className="profile_img_container">
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
              <table className="info_table">
                <tbody>
                  <tr>
                    <td className="label">Display Name</td>
                    <td>{storedUser.name}</td>
                  </tr>
                  <tr>
                    <td className="label">Email</td>
                    <td>{storedUser.email}</td>
                  </tr>
                  <tr>
                    <td className="label">Location</td>
                    <td>{storedUser.city}</td>
                  </tr>
                  <tr>
                    <td className="label">Bio</td>
                    <td>{storedUser.description}</td>
                  </tr>
                  <tr>
                    <td className="label">Password</td>
                    <td>{"*".repeat(storedUser.password.length)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3>Skills I Can Teach</h3>
            {storedUser.knows.length > 0 ? (
              <ul>
                {storedUser.knows.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="empty">No skills added yet.</p>
            )}
          </div>

          <div className="card">
            <h3>Skills I Want to Learn</h3>
            {storedUser.wants.length > 0 ? (
              <ul>
                {storedUser.wants.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="empty">No skills added yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2>My Profile</h2>

          <div className="card">
            <h3>Profile Image</h3>
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
              <div className="image_actions">
                <label className="change_btn">
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </label>
                <button onClick={handleDeleteImage} className="delete_btn_img">
                  Delete
                </button>
              </div>
            </div>
          </div>

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

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={editUser.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="card">
            <h3>Skills I Can Teach</h3>
            <div className="skill_input">
              <input
                type="text"
                value={newTeachSkill}
                onChange={(e) => setNewTeachSkill(e.target.value)}
                placeholder="Add a skill you can teach..."
              />
              <button onClick={addTeachSkill}>Add</button>
            </div>
            <ul>
              {editUser.knows.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Skills I Want to Learn</h3>
            <div className="skill_input">
              <input
                type="text"
                value={newLearnSkill}
                onChange={(e) => setNewLearnSkill(e.target.value)}
                placeholder="Add a skill you want to learn..."
              />
              <button onClick={addLearnSkill}>Add</button>
            </div>
            <ul>
              {editUser.wants.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="edit_actions">
            <button onClick={() => setIsEditing(false)} className="cancel_btn">
              Cancel
            </button>
            <button onClick={handleSave} className="save_btn">
              Save Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
