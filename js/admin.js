document.addEventListener("DOMContentLoaded", fetchData);

const courseGrid = document.querySelector(".courses-grid");
const logoutButton = document.querySelector(".btn-logout");
const adminCourseContainer = document.querySelector(".courses-grid");

const progressButton = document.querySelector("#in-progress-button");
const openButton = document.querySelector("#open-button");
const allCourseButton = document.querySelector("#all-courses-button");

progressButton.addEventListener("click", start);
openButton.addEventListener("click", OpenPage);
allCourseButton.addEventListener("click", AllCourses);

const courses = JSON.parse(localStorage.courses);
const students = JSON.parse(localStorage.students);

let currentButton = "";

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
  if (currentButton != "") {
    currentButton.classList.remove("active");
  }
  progressButton.classList.add("active");
  currentButton = progressButton;

  const instructorName = document.querySelector(".header-username");
  const totalCourses = document.querySelector("#total-courses");
  const totalStudents = document.querySelector("#total-students");

  const currUserName = JSON.parse(localStorage.getItem("currUserInfo"));

  instructorName.innerHTML = `<div class="user-info">
                <span>Welcome, <strong>${currUserName.username}</strong></span></div>`;
  totalCourses.innerHTML = `${courses.length}`;
  totalStudents.innerHTML = `${students.length}`;

  adminCourseContainer.innerHTML = ``;

  for (const course of courses) {
    if (course.registrationOpen === false) {
      adminCourseContainer.innerHTML += generateCourseCard(course);
      const sectionContainer =
        adminCourseContainer.lastElementChild.querySelector(".class-list");
      for (const section of course.sections) {
        sectionContainer.innerHTML += generateSectionCard(section);
      }
    }
  }
}

function logout() {
  window.location.href = "index.html";
  localStorage.clear();
}

function OpenPage() {
  currentButton.classList.remove("active");
  openButton.classList.add("active");
  currentButton = openButton;

  adminCourseContainer.innerHTML = ``;
  for (const course of courses) {
    if (course.registrationOpen === true) {
      adminCourseContainer.innerHTML += generateOpenCourseCard(course);
      const sectionContainer =
        adminCourseContainer.lastElementChild.querySelector(".class-list");
      for (const section of course.sections) {
        sectionContainer.innerHTML += generateSectionCard(section);
      }
    }
  }
}

function AllCourses() {
  currentButton.classList.remove("active");
  allCourseButton.classList.add("active");
  currentButton = allCourseButton;

  adminCourseContainer.innerHTML = ``;
  for (const course of courses) {
    adminCourseContainer.innerHTML += generateCourseCard(course);
    const sectionContainer =
      adminCourseContainer.lastElementChild.querySelector(".class-list");
    for (const section of course.sections) {
      sectionContainer.innerHTML += generateSectionCard(section);
    }
  }
}

const courseDD = document.querySelector(".category-filter");
courseDD.addEventListener("change", courseFilter);

function courseFilter() {
  const category = courseDD.value;
  const allCourses = JSON.parse(localStorage.courses);
  courseGrid.innerHTML = "";
  const categorizedCourses = allCourses.filter(
    (course) => category === course.category
  );

  const filteredCourses = category === "all" ? allCourses : categorizedCourses;
  console.log(filteredCourses);

  filteredCourses.forEach((course) => {
    courseGrid.innerHTML += generateCourseCard(course);
  });
}

const searchBox = document.querySelector(".search-input");
searchBox.addEventListener("input", searchCourses);

function searchCourses() {
  const allCourses = JSON.parse(localStorage.courses);
  const searchingCourse = searchBox.value.trim().toLowerCase();
  console.log(searchingCourse);

  const filteredCourses = allCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchingCourse) ||
      course.code.toLowerCase().includes(searchingCourse)
  );
  console.log(filteredCourses);
  courseGrid.innerHTML = "";
  filteredCourses.forEach((course) => {
    courseGrid.innerHTML += generateCourseCard(course);
  });
}

function generateCourseCard(course) {
  return `<div class="admin-course-card">
      <div class="course-header">
          <h3>${course.code}</h3>
          <span class="course-category">${course.category}</span>
      </div>
      <div class="course-content">
          <h4>${course.name}</h4>
          <p>${course.description}</p>

          <div class="class-info-container">
              <div class="class-info-header">
                  <h5>Sections</h5>
                  <span class="classes-count">${course.sections.length} Section</span>
              </div>
              <div class="class-list">
              </div>
          </div>
      </div>
  </div>`;
}

function generateOpenCourseCard(course) {
  return `<div class="admin-course-card">
      <div class="course-header">
          <h3>${course.code}</h3>
          <span class="course-category">${course.category}</span>
      </div>
      <div class="course-content">
          <h4>${course.name}</h4>
          <p>${course.description}</p>

          <div class="class-info-container">
              <div class="class-info-header">
                  <h5>Sections</h5>
                  <span class="classes-count">${course.sections.length} Section</span>
              </div>
              <div class="class-list">
              </div>
          </div>
      </div>
      <div class="course-footer">
          <button class="btn btn-primary btn-small">Manage Classes</button>
      </div>
  </div>`;
}

function generateSectionCard(section) {
  return `
    <div class="class-item">
        <div class="class-details">
            <span class="instructor">${section.instructor}</span>
            <span class="schedule">${section.schedule}</span>
        </div>
        <div class="class-enrollment">
            <span>${section.enrolled}/30</span>
        </div>
    </div>`;
}
