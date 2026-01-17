import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Signup.module.css";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const result = await signup({
      username: formData.username,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
    if (!result.success) {
      setError(result.error);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className={styles.signup}>
      <div className={styles.signupcontainer}>
        <form onSubmit={handleSubmit} className={styles.signupform}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            autoFocus
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
          <button type="submit" className={styles.signupbutton}>
            Signup
          </button>
        </form>
        <div>{error && <p className={styles.error}>{error}</p>}</div>
        <div>
          <p>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login", { replace: true })}
              className={styles.loginSpan}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
