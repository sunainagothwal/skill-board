import React from "react";
import "./Styles.css";

const UserCard = ({ users = [], onConnect }) => {
  return (
    <section className="page">
      <h2 className="section_title">People on SkillBoard</h2>
      <div className="user_list">
        {users.map((user, index) => (
          <div className="user_card" key={index}>
            <img src={user.img} alt={user.name} className="profile_img" />

            <div className="user_center">
              <h3>{user.name}</h3>
              <p className="city">{user.city}</p>
              <div className="skills">
                {user.knows.split(",").map((skill, i) => (
                  <span key={i} className="skill_tag">
                    {skill.trim()}
                  </span>
                ))}
              </div>
              <p className="description">{user.description}</p>
            </div>

            <div className="user_right">
              <button className="connect_btn" onClick={() => onConnect(user)}>
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserCard;
