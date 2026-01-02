import { useNavigate } from "react-router";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        <p>Uploader</p>
      </div>
      <div className={styles.navbarbuttons}>
        <button className={`${styles.navbarbutton}`} onClick={() => navigate("/login")}>Login</button>
        <button className={`${styles.navbarbutton}`} onClick={() => navigate("/signup")}>Signup</button>
      </div>
    </nav>
  );
}