import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Signup() {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  async function handleSubmit(e){
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    const result = await signup({ username: formData.username, password: formData.password });
    if (!result.success) {
      console.error(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username"
          placeholder="Username" 
          value={formData.username}
          onChange={handleChange}
          required 
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
        <button type="submit">Signup</button>
      </form>
    </main>
  );
}
