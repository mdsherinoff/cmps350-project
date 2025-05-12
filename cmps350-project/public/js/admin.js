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

let courses = [];
let students = [];
let currentButton = "";

logoutButton.addEventListener("click", logout);

async function fetchData() {
  const coursesJSON = await fetch("/api/courses");
  courses = await coursesJSON.json();

  const studentsJSON = await fetch("/api/students");
  students = await studentsJSON.json();

  start();
}

async function start() {
  if (currentButton) {
    currentButton.classList.remove("active");
  }
  progressButton.classList.add("active");
  currentButton = progressButton;

  const adminName = document.querySelector(".header-username");
  const totalCourses = document.querySelector("#total-courses");
  const totalStudents = document.querySelector("#total-students");
  const totalSections = document.querySelector("#total-classes");

  const currUserName = JSON.parse(localStorage.getItem("currUserInfo"));

  adminName.innerHTML = `<div class="user-info">
    <span>Welcome, <strong>${
      currUserName?.username || "Admin"
    }</strong></span></div>`;
  totalCourses.innerHTML = `${courses.length}`;
  totalStudents.innerHTML = `${students.length}`;
  totalSections.innerHTML = courses.reduce(
    (total, course) => total + course.sections.length,
    0
  );

  adminCourseContainer.innerHTML = "";

  for (const course of courses) {
    if (!course.registrationOpen) {
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
  window.location.href = "../index.html";
  localStorage.clear();
}

function OpenPage() {
  if (currentButton) currentButton.classList.remove("active");
  openButton.classList.add("active");
  currentButton = openButton;

  adminCourseContainer.innerHTML = "";
  for (const course of courses) {
    if (course.registrationOpen) {
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
  if (currentButton) currentButton.classList.remove("active");
  allCourseButton.classList.add("active");
  currentButton = allCourseButton;

  adminCourseContainer.innerHTML = "";
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
  let filteredCourses = courses;

  if (category !== "all") {
    filteredCourses = courses.filter((course) => course.category === category);
  }

  if (currentButton === openButton) {
    filteredCourses = filteredCourses.filter(
      (course) => course.registrationOpen
    );
    renderCourses(filteredCourses, generateOpenCourseCard);
  } else if (currentButton === allCourseButton) {
    renderCourses(filteredCourses, generateCourseCard);
  } else {
    filteredCourses = filteredCourses.filter(
      (course) => !course.registrationOpen
    );
    renderCourses(filteredCourses, generateCourseCard);
  }
}

const searchBox = document.querySelector(".search-input");
searchBox.addEventListener("input", searchCourses);

function searchCourses() {
  const searchingCourse = searchBox.value.trim().toLowerCase();
  let filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchingCourse) ||
      course.code.toLowerCase().includes(searchingCourse)
  );

  if (currentButton === openButton) {
    filteredCourses = filteredCourses.filter(
      (course) => course.registrationOpen
    );
    renderCourses(filteredCourses, generateOpenCourseCard);
  } else if (currentButton === allCourseButton) {
    renderCourses(filteredCourses, generateCourseCard);
  } else {
    filteredCourses = filteredCourses.filter(
      (course) => !course.registrationOpen
    );
    renderCourses(filteredCourses, generateCourseCard);
  }
}

function renderCourses(courseList, cardGenerator) {
  courseGrid.innerHTML = "";
  courseList.forEach((course) => {
    courseGrid.innerHTML += cardGenerator(course);
    const sectionContainer =
      courseGrid.lastElementChild.querySelector(".class-list");
    for (const section of course.sections) {
      sectionContainer.innerHTML += generateSectionCard(section);
    }
  });
}

const newCourse = document.querySelector("#createCourseBtn");
newCourse.addEventListener("click", createCourse);

function createCourse() {
  window.location.href = "../html/new_course.html";
}

function generateCourseCard(course) {
  return `<div class="admin-course-card">
      <div class="course-header">
          <h3>${course.code}</h3>
          <span class="course-category">${course.category}</span>
      </div>
      <div class="course-content">
          <h4>${course.name}</h4>
          <div class="class-info-container">
              <div class="class-info-header">
                  <h5>Sections</h5>
                  <span class="classes-count">${course.sections.length} Section</span>
              </div>
              <div class="class-list"></div>
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
          <div class="class-info-container">
              <div class="class-info-header">
                  <h5>Sections</h5>
                  <span class="classes-count">${
                    course.sections.length
                  } Section</span>
              </div>
              <div class="class-list"></div>
          </div>
      </div>
      <div class="course-footer">
          <button onclick='manageClasses(${JSON.stringify(
            course
          )})' class="btn btn-primary btn-small">Manage Classes</button>
      </div>
  </div>`;
}

function generateValidateCourseCard(course, section) {
  return `
    <div class="course-card">
      <div class="course-header">
        <h3>${course.code} - L${section.crn}</h3>
        <span class="course-category">${course.category}</span>
      </div>
      <div class="course-content">
        <h4>${course.name}</h4>
        <div class="course-details">
          <span><i class="fas fa-user"></i> ${section.instructor}</span>
          <span><i class="fas fa-users"></i> ${section.enrolled}/30</span>
        </div>
        <div class="course-details">
          <span><i class="fas fa-clock"></i> ${
            course.registrationOpen
              ? "Registration : Open"
              : "Registration : Closed"
          }</span>
          <span><i class="fas fa-users"></i> ${section.schedule}</span>
        </div>
      </div>
      <div style="display: flex; justify-content: center;" class="course-footer">
        <button onclick='validateSection(${JSON.stringify(
          course
        )}, ${JSON.stringify(
    section
  )}, this)' class="btn btn-primary">Validate Section</button>
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

function manageClasses(course) {
  adminCourseContainer.innerHTML = "";
  for (const section of course.sections) {
    if (section.status === "open") {
      adminCourseContainer.innerHTML += generateValidateCourseCard(
        course,
        section
      );
    }
  }
}

async function validateSection(validatedCourse, validatedSection, button) {
  await fetch(`/api/sections`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      crn: validatedSection.crn,
      status: "closed",
    }),
  });
  button.style.backgroundColor = "green";
  button.style.cursor = "not-allowed";
  button.disabled = true;
  button.innerText = "Class Validated";
  await fetchData(); 
}
