async function userInput() {
  const users = await fetch("http://localhost:3000/api/users");
  const userData = await users.json();
  console.log(userData);


  const students = await fetch("http://localhost:3000/api/students");
  const studentsData = await students.json();
  console.log(studentsData);
  

  const instructors = await fetch("http://localhost:3000/api/instructors");
  const instructorsData = await instructors.json();

  const loginForm = document.querySelector("#loginForm");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");
  const userType = document.querySelector("#userType");

  loginForm.addEventListener("submit", function handleUserValidation(e) {
    e.preventDefault();

    const enteredUsername = username.value.trim();
    const enteredPassword = password.value.trim();
    const enteredUserType = userType.value.trim().toLowerCase();

    const user = userData.find((user) => user.username === enteredUsername);

    if (!user || user.password !== enteredPassword) {
      alert("Incorrect Username or Password");
      return;
    }

    if (user.role !== enteredUserType) {
      console.log(user.role.toLowerCase());
            console.log(enteredUserType);

      
      alert("False User Type");
      return;
    }

    alert(`Login Successful\nWelcome ${user.role.toUpperCase()}, ${user.username}`);
    localStorage.setItem("userId", JSON.stringify(user.id));

    const userId = user.id;

    if (enteredUserType === "student") {
      const currUserInfo = studentsData.find((student) => student.id === userId);
      localStorage.setItem("currUserInfo", JSON.stringify(currUserInfo));
    } else if (enteredUserType === "instructor") {
      const currUserInfo = instructorsData.find((instructor) => instructor.id === userId);
      localStorage.setItem("currUserInfo", JSON.stringify(currUserInfo));
    } else if (enteredUserType === "admin") {
      localStorage.setItem("currUserInfo", JSON.stringify(user));
    }

    switch (enteredUserType) {
      case "student":
        window.location.href = "../html/student-home.html";
        break;
      case "instructor":
        window.location.href = "../html/instructor-home.html";
        break;
      case "admin":
        window.location.href = "../html/admin-home.html";
        break;
      default:
        alert("Unknown user type");
        break;
    }
  });
}

userInput();
