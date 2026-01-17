import { useNavigate } from "react-router";
import styles from "./Home.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <DotLottieReact
          className={styles.animation}
          src="/assets/upload.lottie"
          autoplay
        />
      </section>
      <section className={styles.details}>
        <p className={styles.appName}>Uploader</p>
        <button
          className={styles.signInButton}
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
        <p className={styles.tagLine}>
          Store, organize, and access your files from anywhere, across multiple
          devices.
        </p>
      </section>
      <section className={styles.empty}>

      </section>
      <section className={styles.cta}>
          <h2>Ready to get started?</h2>
          <p>Join now and start storing your files today</p>
          <button
            className={styles.ctaButton}
            onClick={() => navigate("/signup")}
          >
            Create Free Account
          </button>
        </section>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>
              About
            </a>
            <a href="#" className={styles.footerLink}>
              Privacy Policy
            </a>
            <a href="#" className={styles.footerLink}>
              Terms of Service
            </a>
            <a href="#" className={styles.footerLink}>
              Contact
            </a>
          </div>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Uploader. Part of The Odin Project.
          </p>
        </div>
      </footer>
    </div>
  );
}
