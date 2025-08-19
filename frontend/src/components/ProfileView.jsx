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
    phone: "",
  });

  const [editUser, setEditUser] = useState(storedUser);
  const [newTeachSkill, setNewTeachSkill] = useState("");
  const [newLearnSkill, setNewLearnSkill] = useState("");

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  // Add skills
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

  // Save changes
  const handleSave = () => {
    setStoredUser(editUser);
    setIsEditing(false);
  };

  return (
    <div className="profile_page">
      {!isEditing ? (
        // ---------------- VIEW MODE ----------------
        <div>
          <div className="header_row">
            <h2>My Profile</h2>
            <button className="edit_button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>

          {/* Profile Information */}
          <div className="card">
            <h3>Profile Information</h3>
            <div className="profile_info_row">
              <div className="profile_img_container">
                <img
                  src={storedUser.img}
                  alt={storedUser.name}
                  className="profile_img"
                />
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
                </tbody>
              </table>
            </div>
          </div>

          {/* Skills I Can Teach */}
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

          {/* Skills I Want to Learn */}
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
        // ---------------- EDIT MODE ----------------
        <div>
          <h2>My Profile</h2>

          {/* Basic Information */}
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

          {/* Skills I Can Teach */}
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

          {/* Skills I Want to Learn */}
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

          {/* Buttons */}
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
