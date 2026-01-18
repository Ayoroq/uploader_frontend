import { useNavigate } from "react-router";
import {useEffect} from 'react'
import styles from "./Home.module.css";
import upload from '/assets/Uploading.png'
import download from '/assets/downloading.png'
import video from '/assets/video.mp4'

export default function Home() {
  const navigate = useNavigate();

  useEffect(() =>{
    window.scrollTo(0,0)
  },[])

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <video autoPlay muted loop playsInline className={styles.video}>
          <source src={video} type="video/mp4" />
        </video>
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
      <section className={styles.images}>
        <img src={upload} alt="upload" className={styles.image} />
        <img src={download} alt="download" className={styles.image} />
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
