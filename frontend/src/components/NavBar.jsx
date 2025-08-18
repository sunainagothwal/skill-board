import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Styles.css";

function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateSwapClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/create-swap" } });
    } else {
      navigate("/create-swap");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo-section">
        <span className="logo">SkillBoard</span>
        <span className="tagline">by Sunaina</span>
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
          <a
            href="/create-swap"
            onClick={(e) => {
              handleCreateSwapClick(e);
              setMobileMenuOpen(false);
            }}
            className={
              location.pathname === "/create-swap" ? "active-link" : ""
            }
          >
            Create Swap
          </a>
        </li>
        <li className="profile_dropdown" ref={dropdownRef}>
          <span
            className="profile_link"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Account
          </span>
          {dropdownOpen && (
            <div className="dropdown">
              {isLoggedIn ? (
                <>
                  <div
                    className="drop_item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link to="/profileview">Profile</Link>
                  </div>
                  <div
                    className="drop_item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link to="/mytask">My Task</Link>
                  </div>
                  <div
                    className="drop_item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Link to="/settings">Settings</Link>
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
                  <Link to="/login">Login / Signup</Link>
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
