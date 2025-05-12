async function userInput() {
  // Fetch data (You can fetch these once if they are static or frequently needed)
  const users = await fetch("http://localhost:3000/api/users");
  const userData = await users.json();

  const students = await fetch("http://localhost:3000/api/students");
  const studentsData = await students.json();

  const instructors = await fetch("http://localhost:3000/api/instructors");
  const instructorsData = await instructors.json();

  // Form elements
  const loginForm = document.querySelector("#loginForm");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");
  const userType = document.querySelector("#userType");

  // Handle form submission
  loginForm.addEventListener("submit", async function handleUserValidation(e) {
    e.preventDefault();

    const enteredUsername = username.value.trim();
    const enteredPassword = password.value.trim();
    const enteredUserType = userType.value.trim();

    // Fetch user by ID (or username, depending on your database)
    try {
      const user = await getUserById(enteredUsername);  // Call the GET method

      // Check if user exists
      if (!user) {
        alert("User not found!");
        return;
      }

      // Validate the password
      if (user.password === enteredPassword) {
        // User is authenticated, check user type and handle accordingly
        if (enteredUserType === 'student') {
          const student = studentsData.find((student) => student.username === enteredUsername);
          if (student) {
            // Handle student login
            alert("Student logged in successfully");
          }
        } else if (enteredUserType === 'instructor') {
          const instructor = instructorsData.find((instructor) => instructor.username === enteredUsername);
          if (instructor) {
            // Handle instructor login
            alert("Instructor logged in successfully");
          }
        } else {
          alert("Invalid user type");
        }
      } else {
        alert("Incorrect password");
      }
    } catch (error) {
      console.error(error);
      alert("Error validating user.");
    }
  });
}

// Async function to fetch user by ID
async function getUserById(username) {
  try {
    const response = await fetch(`http://localhost:3000/api/users?id=${username}`);
    if (!response.ok) {
      throw new Error("User not found");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Call the userInput function
userInput();
