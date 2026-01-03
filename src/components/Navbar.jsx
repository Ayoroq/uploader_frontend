import { useNavigate } from "react-router";
import styles from "./Navbar.module.css";
import {useAuth} from '../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate();
  const {user, loading} = useAuth();
  
  if(loading){
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        <p>Uploader</p>
      </div>
      <div className={styles.navbarbuttons}>
        {user ? (
          <p>{user.user.username}</p>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className={styles.loginbutton}>Login</button>
            <button onClick={() => navigate('/signup')} className={styles.signupbutton}>Signup</button>
          </>
        )}
      </div>
    </nav>
  );
}