async function userInput() {
  const students = await fetch("http://localhost:3000/api/students");
  const studentsData = await students.json();

  const instructors = await fetch("http://localhost:3000/api/instructors");
  const instructorsData = await instructors.json();
  

  const loginForm = document.querySelector("#loginForm");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");
  const userType = document.querySelector("#userType");

  loginForm.addEventListener("submit", async function handleUserValidation(e) {
    e.preventDefault();

    const enteredUsername = username.value.trim();
    const enteredPassword = password.value.trim();
    const enteredUserType = userType.value.trim();

    const user = await getUserbyUsername(enteredUsername);
    console.log(user);
    console.log(user.username);
    console.log(user.passwordHash);

    if (!user) {
      alert("User not found!");
      return;
    }

    if (!user || user.passwordHash !== enteredPassword) {
      alert("Incorrect Username or Password");
      return;
    }
    if (
      user.role.trim().toUpperCase() !== enteredUserType.trim().toUpperCase()
    ) {
      alert("False User Type");
    return;} 
    else {alert(`Login Successful \nWelcome ${user.role.toUpperCase()}, ${user.username}`);}
    
    localStorage.setItem("userId", JSON.stringify(user.studentProfile.studentUId));
    let userId = null;
    let currUserInfo = null;

    switch (enteredUserType) {
      case "STUDENT":
        userId = JSON.parse(localStorage.getItem("userId"));
        currUserInfo = studentsData.find(
          (student) => student.studentUId === userId
        );
        localStorage.setItem("currUserInfo", JSON.stringify(user));
        window.location.href = "../html/student-home.html";

        break;
      case "INSTRUCTOR":
        userId = JSON.parse(localStorage.getItem("userId"));
        currUserInfo = instructorsData.find(
          (instructor) => instructor.id === userId
        );
        localStorage.setItem("currUserInfo", JSON.stringify(user));
        window.location.href = "../html/instructor-home.html";

        break;
      case "ADMIN":
        // userId = JSON.parse(localStorage.getItem("userId"));
        // currUserInfo = userData.find((user) => user.id === userId);
        localStorage.setItem("currUserInfo", JSON.stringify(user));
        window.location.href = "../html/admin-home.html";

        break;
    }
  });
}

function handleCredentialResponse(response) {
  alert("Login successful! Token received.");
  console.log("Token:", response.credential);
  window.location.href = "/html/student-home.html";
  localStorage.setItem("currUserInfo", JSON.stringify(currUserInfo));
}

async function getUserbyUsername(username) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/users?username=${username}`
    );
    if (!response.ok) {
      throw new Error("User not found");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

userInput();
