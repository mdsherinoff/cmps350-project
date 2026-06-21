"use client";
import React, { useState } from "react";

const Home = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    userType: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users");
      const users = await res.json();
      const user = users.find((item) => item.username === formData.username);

      if (!user || user.passwordHash !== formData.password) {
        setError("Incorrect username or password.");
        return;
      }

      if (user.role.toLowerCase() !== formData.userType.toLowerCase()) {
        setError("Selected role does not match user role.");
        return;
      }

      localStorage.setItem("userId", JSON.stringify(user.id));
      localStorage.setItem("currUserInfo", JSON.stringify(user));
      const destination =
        user.role.toLowerCase() === "student"
          ? "/html/student-home.html"
          : user.role.toLowerCase() === "instructor"
            ? "/html/instructor-home.html"
            : "/html/admin-home.html";
      window.location.href = destination;
    } catch (err) {
      console.error(err);
      setError("Unable to sign in. Please try again.");
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Course Management Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Role
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
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

export default Home;
