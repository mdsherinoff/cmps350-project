// 'use client'
// import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     userType: ''
//   });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value.trim()
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       // Fetch all necessary data
//       const [usersRes, studentsRes, instructorsRes] = await Promise.all([
//         fetch("http://localhost:3000/api/users"),
//         fetch("http://localhost:3000/api/students"),
//         fetch("http://localhost:3000/api/instructors")
//       ]);

//       const userData = await usersRes.json();
//       const studentsData = await studentsRes.json();
//       const instructorsData = await instructorsRes.json();

//       const user = userData.find(user => user.username === formData.username);

//       if (!user || user.password !== formData.password) {
//         setError("Incorrect Username or Password");
//         return;
//       }

//       if (user.role !== formData.userType) {
//         setError("False User Type");
//         return;
//       }

//       // Store user ID in localStorage
//       localStorage.setItem("userId", JSON.stringify(user.id));

//       // Store current user info based on user type
//       let currUserInfo;
//       if (formData.userType === "student") {
//         currUserInfo = studentsData.find(student => student.id === user.id);
//       } else if (formData.userType === "instructor") {
//         currUserInfo = instructorsData.find(instructor => instructor.id === user.id);
//       } else if (formData.userType === "administrator") {
//         currUserInfo = user;
//       }

//       localStorage.setItem("currUserInfo", JSON.stringify(currUserInfo));

//       // Navigate based on user type
//       switch (formData.userType) {
//         case "student":
//           navigate("/student-home");
//           break;
//         case "instructor":
//           navigate("/instructor-home");
//           break;
//         case "administrator":
//           navigate("/admin-home");
//           break;
//         default:
//           break;
//       }

//     } catch (error) {
//       setError("An error occurred during login. Please try again.");
//       console.error("Login error:", error);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="login-form">
//         <h2>Login</h2>
//         {error && <div className="error-message">{error}</div>}
        
//         <div className="form-group">
//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="userType">User Type:</label>
//           <select
//             id="userType"
//             name="userType"
//             value={formData.userType}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select User Type</option>
//             <option value="student">Student</option>
//             <option value="instructor">Instructor</option>
//             <option value="administrator">Administrator</option>
//           </select>
//         </div>

//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login; 