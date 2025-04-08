async function userInput() {
  const users = await fetch("../data/users.json");
  const userData = await users.json();

  const students = await fetch("../data/students.json");
  const studentsData = await students.json();

  const instructors = await fetch("../data/instructors.json");
  const instructorsData = await instructors.json();

  const loginForm = document.querySelector("#loginForm");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");
  const userType = document.querySelector("#userType");

  loginForm.addEventListener("submit", function handleUserValidation(e) {
    e.preventDefault();

    const enteredUsername = username.value.trim();
    const enteredPassword = password.value.trim();
    const enteredUserType = userType.value.trim();

    const user = userData.find((user) => user.username === enteredUsername);

    if (!user || user.password !== enteredPassword) {
      alert("Incorrect Username or Password");
      return;
    }
    if (user.role !== enteredUserType) {
      alert("False User Type");
      return;
    } else {
      alert(
        `Login Successful \nWelcome ${user.role.toUpperCase()}, ${user.username}`
      );
    }

    localStorage.setItem("userId", JSON.stringify(user.id));

    switch (enteredUserType) {
      case "student":
        window.location.href = "student-home.html";
        break;
      case "instructor":
        window.location.href = "instructor-home.html";
        break;
      case "administrator":
        window.location.href = "admin-home.html";
        break;
    }

    if (enteredUserType === "student") {
      const userId = JSON.parse(localStorage.getItem("userId"));
      const currUserInfo = studentsData.find(
        (student) => student.id === userId
      );
      localStorage.setItem("currUserInfo", JSON.stringify(currUserInfo));
    }
    if (enteredUserType === "instructor") {
      const userId = JSON.parse(localStorage.getItem("userId"));
      const currUserInfo = instructorsData.find(
        (instructor) => instructor.id === userId
      );
      localStorage.setItem("currUserInfo", JSON.stringify(currUserInfo));
    }
    if (enteredUserType === "administrator") {
      const userId = JSON.parse(localStorage.getItem("userId"));
      const currUserInfo = userData.find((user) => user.id === userId);
      localStorage.setItem("currUserInfo", JSON.stringify(currUserInfo));
    }
  });
}

userInput();
