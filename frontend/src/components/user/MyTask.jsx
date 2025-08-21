import React from "react";
import { useNavigate } from "react-router-dom";


const MyTask = ({ tasks = [] }) => {
  const navigate = useNavigate();

  const sections = {
    ongoing: tasks.filter((t) => t.status === "ongoing"),
    pending: tasks.filter((t) => t.status === "pending"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">My Task</h2>
      
      <div className="search-bar">
        <input type="text" placeholder="Search for tasks or users" />
      </div>

      <div className="welcome-card">
        <h3>Welcome back, Sunaina!</h3>
        <p>Here’s what’s happening with your tasks today.</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="icon-box ongoing">
            <i className="fas fa-tasks"></i>
          </div>
          <h4>Ongoing Tasks</h4>
          <p className="count">{sections.ongoing.length}</p>
          <a href="#ongoing" className="view-link">
            View all
          </a>
        </div>

        <div className="summary-card">
          <div className="icon-box pending">
            <i className="fas fa-clock"></i>
          </div>
          <h4>Pending Tasks</h4>
          <p className="count">{sections.pending.length}</p>
          <a href="#pending" className="view-link">
            View all
          </a>
        </div>

        <div className="summary-card">
          <div className="icon-box completed">
            <i className="fas fa-check-circle"></i>
          </div>
          <h4>Completed Tasks</h4>
          <p className="count">{sections.completed.length}</p>
          <a href="#completed" className="view-link">
            View all
          </a>
        </div>
      </div>

      <div className="footer-banner">
        <p>Ready to find your next task?</p>
        <button onClick={() => navigate("/browse")}>Browse Tasks</button>
      </div>
    </div>
  );
};

export default MyTask;
