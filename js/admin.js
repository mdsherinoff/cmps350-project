document.addEventListener("DOMContentLoaded", fetchData);

const courseGrid = document.querySelector(".courses-grid");
const logoutButton = document.querySelector(".btn-logout");
logoutButton.addEventListener("click", logout);

async function fetchData() {
  const courses = await fetch("../data/courses.json");
  let courseList = await courses.json();
  localStorage.courses = JSON.stringify(courseList);

  const students = await fetch("../data/students.json");
  let studentList = await students.json();
  localStorage.students = JSON.stringify(studentList);

  start();
}

async function start() {
  const instructorName = document.querySelector(".header-username");
  const totalCourses = document.querySelector("#total-courses");
  const totalStudents = document.querySelector("#total-students");

  const currUserName = JSON.parse(localStorage.getItem("currUserInfo"));
  const courses = JSON.parse(localStorage.courses);
  const students = JSON.parse(localStorage.students);

  instructorName.innerHTML = `<div class="user-info">
                <span>Welcome, <strong>${currUserName.username}</strong></span></div>`;
  totalCourses.innerHTML = `${courses.length}`;
  totalStudents.innerHTML = `${students.length}`;
}

const courseDD = document.querySelector(".category-filter");
courseDD.addEventListener("change", courseFilter);

function courseFilter() {
  const category = courseDD.value;
}

function logout() {
  window.location.href = "index.html";
  localStorage.clear();
}
