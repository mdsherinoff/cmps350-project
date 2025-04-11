document.addEventListener("DOMContentLoaded", fetchData);

const scheduleGrid = document.querySelector("schedule-grid");
const logoutButton = document.querySelector(".btn-logout");

const allButton = document.querySelector("all-days-button");
const specificButton = document.querySelector("specific-days-button");

allButton.addEventListener("click",start);
specificButton("click",specifics);

async function fetchData() {
    const coursesJSON = await fetch("../data/courses.json");
    // const courses = await fetch("http://localhost:3000/api/courses");
    courseList = await coursesJSON.json();
    localStorage.courses = JSON.stringify(courseList);
  
    const studentsJSON = await fetch("../data/students.json");
    studentList = await studentsJSON.json();
    localStorage.students = JSON.stringify(studentList);
  
    courses = JSON.parse(localStorage.courses);
    students = JSON.parse(localStorage.students);
  
    start();

  }


  logoutButton.addEventListener("click", logout);

  function logout() {
    window.location.href = "../index.html";
    localStorage.clear();
  }