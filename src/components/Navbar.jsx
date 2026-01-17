import { useNavigate } from "react-router";
import styles from "./Navbar.module.css";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import logoutIcon from '/assets/logout.svg'

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (loading) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        <p>Uploader</p>
      </div>
      <div className={styles.navbarbuttons}>
        {user ? (
          <div className={styles.userSection} ref={dropdownRef}>
            <p 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user.user.username}
            </p>
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                <p className={styles.username} >{user.user.username}</p>
                <button onClick={logout} className={styles.logOutContainer}>
                  <img src={logoutIcon} className={styles.logOutIcon}  alt="logout" />
                  Logout
                </button>
              </div>
              
            )}
          </div>
        )  : (
          <div className={styles.authButtons}>
            <button
              onClick={() => navigate("/login")}
              className={`${styles.navbarbutton}`}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className={`${styles.navbarbutton}`}
            >
              Signup
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
