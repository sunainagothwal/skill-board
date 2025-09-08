import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../common/context/auth-context.jsx";
import { FaUser, FaBell } from "react-icons/fa";

function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthContext();

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔔 Poll for notifications (replace with WebSocket later)
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/notifications`,
          {
            method: "GET",
            credentials: "include", // ✅ send HttpOnly cookies
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch notifications:", res.status);
          return;
        }

        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotifClick = async () => {
    setNotifOpen(!notifOpen);

    if (!notifOpen) {
      try {
         await fetch(
           `${import.meta.env.VITE_APP_BACKEND_URL}/notifications/mark-read`,
           {
             method: "POST",
             credentials: "include",
           }
         );
         // ✅ mark them read locally
         setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error("Failed to mark notifications as read", err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/users/logout`, {
        method: "POST",
        credentials: "include", // ✅ ensures cookie clears on backend
      });
    } catch (err) {
      console.error("Logout failed", err);
    }
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo-section">
        <span className="logo">SkillBoard</span>
      </div>

      <div
        className="hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        ☰
      </div>

      <ul className={`nav_links ${mobileMenuOpen ? "open" : ""}`}>
        <li>
          <Link
            to="/"
            className={location.pathname === "/" ? "active-link" : ""}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/create-swap"
            onClick={() => setMobileMenuOpen(false)}
            className={
              location.pathname === "/create-swap" ? "active-link" : ""
            }
          >
            Create Swap
          </Link>
        </li>
        <li>
          <Link
            to="/requests"
            onClick={() => setMobileMenuOpen(false)}
            className={location.pathname === "/requests" ? "active-link" : ""}
          >
            Requests
          </Link>
        </li>

        {/* 🔔 Notification Bell */}
        {isLoggedIn && (
          <li className="notification_dropdown" ref={notifRef}>
            <span
              className="notification_link"
              onClick={handleNotifClick}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <FaBell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    fontSize: "12px",
                    padding: "2px 6px",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </span>
            {notifOpen && (
              <div className="dropdown notif-dropdown">
                {notifications.length === 0 ? (
                  <div className="drop_item">No new notifications</div>
                ) : (
                  notifications.map((n, idx) => (
                    <div key={idx} className="drop_item">
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </li>
        )}

        <li className="profile_dropdown" ref={dropdownRef}>
          <span
            className="profile_link"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Account
            <div className="profile_icon">
              <FaUser />
            </div>
          </span>
          {dropdownOpen && (
            <div className="dropdown">
              {isLoggedIn ? (
                <>
                  <div
                    className="drop_item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link to="/profileview" className="dropdown-text">
                      Profile
                    </Link>
                  </div>
                  <div
                    className="drop_item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link to="/my-tasks" className="dropdown-text">
                      My Tasks
                    </Link>
                  </div>
                  <div
                    className="drop_item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link to="/change_password" className="dropdown-text">
                      Change Password
                    </Link>
                  </div>
                  <div
                    className="drop_item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link to="/settings" className="dropdown-text">
                      Settings
                    </Link>
                  </div>
                  <div className="drop_item" onClick={handleLogout}>
                    Logout
                  </div>
                </>
              ) : (
                <div
                  className="drop_item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Link to="/login" className="dropdown-text">
                    Login / Signup
                  </Link>
                </div>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
