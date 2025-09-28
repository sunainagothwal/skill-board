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

          <div className="card">
            <h3>Skills I Can Teach</h3>
            <div className="skill_input">
              <input
                type="text"
                value={newTeachSkill}
                onChange={(e) => setNewTeachSkill(e.target.value)}
                placeholder="Add a skill you can teach..."
              />
              <button onClick={addTeachSkill} className="add_btn">
                +
              </button>
            </div>
            <ul className="skills_list">
              {editUser.knows.map((skill, idx) => (
                <li key={idx} className="skill_item">
                  {skill}
                  <button
                    className="remove_skill_btn"
                    onClick={() => removeTeachSkill(idx)}
                  >
                    ✕
                  </button>
                </li>
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
              <button onClick={addTeachSkill} className="add_btn">
                +
              </button>
            </div>
            <ul className="skills_list">
              {editUser.knows.map((skill, idx) => (
                <li key={idx} className="skill_item">
                  {skill}
                  <button
                    className="remove_skill_btn"
                    onClick={() => removeTeachSkill(idx)}
                  >
                    ✕
                  </button>
                </li>
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
