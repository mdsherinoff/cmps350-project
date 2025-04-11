let courses = "";
let students = "";

let courseList = "";
let studentList = "";

let daylist = "";

let currentButton = "";

document.addEventListener("DOMContentLoaded", fetchData);

const scheduleGrid = document.querySelector("schedule-grid");
const logoutButton = document.querySelector(".btn-logout");

const allButton = document.querySelector("all-days-button");
const specificButton = document.querySelector("specific-days-button");

allButton.addEventListener("click", start);
specificButton.addEventListener("click", specifics);

async function fetchData() {
  // const coursesJSON = await fetch("../data/courses.json");
  const courses = await fetch("http://localhost:3000/api/courses");

  courseList = await coursesJSON.json();
  localStorage.courses = JSON.stringify(courseList);

  const studentsJSON = await fetch("http://localhost:3000/api/students");
  // const studentsJSON = await fetch("../data/students.json");
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

async function start() {
  if (currentButton != "") {
    currentButton.classList.remove("active");
  }
  allButton.classList.add("active");
  currentButton = allButton;

  const adminName = document.querySelector(".header-username");

  const currUserName = JSON.parse(localStorage.getItem("currUserInfo"));
  console.log(`${currUserName.username}`);
  adminName.innerHTML = `<div class="user-info">
                <span>Welcome, <strong>${currUserName.username}</strong></span></div>`;

  for (const course of courses) {
  }
}

function generateScheduleCard(course) {
  return `<div class="schedule-course-card">
        <div class="schedule-course-name">
            <h3>${course.code}</h3>
            `;
}
