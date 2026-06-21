"use client"
import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "", userType: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users");
      const users = await res.json();
      const user = users.find((item) => item.username === formData.username);

      if (!user || user.password !== formData.password) {
        setError("Incorrect username or password.");
        return;
      }

      if (user.role !== formData.userType) {
        setError("User type does not match.");
        return;
      }

      localStorage.setItem("userId", JSON.stringify(user.id));
      localStorage.setItem("currUserInfo", JSON.stringify(user));

      let destination = "/";
      if (user.role === "student") destination = "/student-home";
      if (user.role === "instructor") destination = "/instructor-home";
      if (user.role === "admin") destination = "/admin-home";
      window.location.href = destination;
    } catch (error) {
      setError("Unable to login. Please try again later.");
      console.error(error);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input name="username" value={formData.username} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>
          <label>
            Role
            <select name="userType" value={formData.userType} onChange={handleChange} required>
              <option value="">Select role</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
          <button type="submit">Sign In</button>
        </form>
      </section>
    </main>
  );
};

export default Login;
