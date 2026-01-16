import { useNavigate } from 'react-router';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Store, Share, Access Anywhere
        </h1>
        <p className={styles.heroSubtitle}>
          Your files, always within reach. Upload, organize, and share your documents securely from any device.
        </p>
        <div className={styles.heroCta}>
          <button className={styles.primaryBtn} onClick={() => navigate('/signup')}>
            Get Started Free
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.sectionTitle}>Everything You Need</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📁</div>
              <h3 className={styles.featureTitle}>Organize with Folders</h3>
              <p className={styles.featureDescription}>
                Create nested folders to keep your files organized exactly the way you want.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>☁️</div>
              <h3 className={styles.featureTitle}>Cloud Storage</h3>
              <p className={styles.featureDescription}>
                Upload files of any type and access them from anywhere, anytime.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔗</div>
              <h3 className={styles.featureTitle}>Easy Sharing</h3>
              <p className={styles.featureDescription}>
                Generate shareable links instantly and collaborate with anyone.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👁️</div>
              <h3 className={styles.featureTitle}>File Preview</h3>
              <p className={styles.featureDescription}>
                Preview images, PDFs, and documents without downloading them.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3 className={styles.featureTitle}>Mobile Friendly</h3>
              <p className={styles.featureDescription}>
                Fully responsive design works seamlessly on desktop and mobile.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3 className={styles.featureTitle}>Secure & Private</h3>
              <p className={styles.featureDescription}>
                Your files are encrypted and protected with secure authentication.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Create Account</h3>
            <p className={styles.stepDescription}>
              Sign up in seconds with just your email and password.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Upload Files</h3>
            <p className={styles.stepDescription}>
              Drag and drop or browse to upload your files and create folders.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Access Anywhere</h3>
            <p className={styles.stepDescription}>
              Access your files from any device, share with others, and stay organized.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
        <p className={styles.ctaDescription}>
          Join thousands of users managing their files effortlessly
        </p>
        <button className={styles.ctaButton} onClick={() => navigate('/signup')}>
          Create Free Account
        </button>
      </section>

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