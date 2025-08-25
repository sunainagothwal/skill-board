import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../common/context/auth-context.jsx";  // ✅ use context


function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  //shared context, not fresh hook
  const {isLoggedIn, logout}= useAuthContext();  

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLogout = () => {
    logout();
    navigate("/");
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
                className={location.pathname === "/create-swap" ? "active-link" : ""}
              >
                Create Swap
              </Link>

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
