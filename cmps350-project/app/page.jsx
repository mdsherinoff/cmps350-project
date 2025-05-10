// 'use client'
// import React, { useState } from 'react';

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

//       localStorage.setItem("userId", JSON.stringify(user.id));

//       let currUserInfo;
//       if (formData.userType === "student") {
//         currUserInfo = studentsData.find(student => student.id === user.id);
//       } else if (formData.userType === "instructor") {
//         currUserInfo = instructorsData.find(instructor => instructor.id === user.id);
//       } else if (formData.userType === "administrator") {
//         currUserInfo = user;
//       }

//       localStorage.setItem("currUserInfo", JSON.stringify(currUserInfo));

//       switch (formData.userType) {
//         case "student":
//           window.location.href = "/student-home.html";
//           break;
//         case "instructor":
//           window.location.href = "/instructor-home.html";
//           break;
//         case "administrator":
//           window.location.href = "/admin-home.html";
//           break;
//         default:
//           break;
//       }

      

//     } catch (error) {
//       setError("An error occurred during login. Please try again.");
//       console.error("Login error:", error);
//     }
//   };

//   const handleCredentialResponse = (response) => {
//     alert("Login successful! Token received.");
//     console.log("Token:", response.credential);
//     window.location.href = "/student-home.html";
//   };

//   return (
//     <div className="login-main">
//       <div className="login-container">
//         <div className="login-header">
//           <img
//             src="images/logo qu w.png"
//             alt="Qatar University Logo"
//             className="logo"
//           />
//           <h1>Student Management System</h1>
//           <p className="subtitle">CSE Department - Qatar University</p>
//         </div>

//         <div className="login-form-container">
//           <div className="login-form">
//             <h2>Login</h2>
//             {error && <div className="error-message">{error}</div>}
            
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label htmlFor="username">Username</label>
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   placeholder="Enter your username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password">Password</label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="userType">I am a:</label>
//                 <select
//                   id="userType"
//                   name="userType"
//                   value={formData.userType}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="" disabled>Select your role</option>
//                   <option value="student">Student</option>
//                   <option value="instructor">Instructor</option>
//                   <option value="administrator">Department Administrator</option>
//                 </select>
//               </div>

//               <div
//                 id="g_id_onload"
//                 data-client_id="534020392954-i545saoniv7fk3sccglk8h4s7upup33d.apps.googleusercontent.com"
//                 data-callback="handleCredentialResponse"
//                 data-auto_prompt="false"
//               ></div>

//               <div
//                 id="g_id_signin"
//                 className="g_id_signin"
//                 data-type="standard"
//               ></div>

//               <button type="submit" className="btn btn-primary">
//                 Login
//               </button>
//             </form>

//             <div className="login-footer">
//               <p>CMPS 350 Web Development Course Project Phase 1</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;