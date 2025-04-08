async function userInput() {
  const users = await fetch("../data/users.json");
  const userData = await users.json();

  const loginForm = document.querySelector("#loginForm");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");
  const userType = document.querySelector("#userType");

  if (!loginForm) return;

  loginForm.addEventListener("submit", function handleUserValidation(e) {
    e.preventDefault();

    console.log("Login form submitted");

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
    }

    alert(
      `Login Successful \nWelcome ${user.role.toUpperCase()}, ${user.username}`
    );
    console.log(user.id);

    switch(enteredUserType){
      case "student":
        window.location.href = "student-home.html";
        break;
      case "instructor":
        window.location.href = "instructor-home.html";
        break;
      case "administrator":
        window.location.href = "admin-home.html";
        break;
      default:
        break;
      
    }

    localStorage.setItem("user",JSON.stringify(user.id))//rename this as userId since the whole user isnt pushed
  });
}

userInput();
