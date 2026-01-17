import { useNavigate } from 'react-router';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>About</a>
            <a href="#" className={styles.footerLink}>Privacy Policy</a>
            <a href="#" className={styles.footerLink}>Terms of Service</a>
            <a href="#" className={styles.footerLink}>Contact</a>
          </div>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Uploader. Part of The Odin Project.
          </p>
        </div>
      </footer>
    </div>
  );
}