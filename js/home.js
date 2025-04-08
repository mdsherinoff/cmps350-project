const BASE_URL = "http://127.0.0.1:3000/cmps350-project/home.html";

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
  const courses = JSON.parse(localStorage.courses);
  courseGrid.innerHTML = "";

  courses.forEach((course) => {
    const courseCard = document.createElement("div");
    courseCard.classList.add("course-card");

    courseCard.innerHTML = `
      <div class="course-header">
        <h3>${course.code}</h3>
        <span class="course-category">${course.category}</span>
      </div>
      <div class="course-content">
        <h4>${course.name}</h4>
        <p>${course.description}</p>
        <div class="course-details">
          <span><i class="fas fa-user"></i> Instructors : ${course.sections.reduce((sum) => sum + 1, 0)}</span>
          <span><i class="fas fa-users"></i> Total Enrolled : ${course.sections.reduce((sum, section) => sum + section.enrolled, 0)}</span>
        </div>
        <div class="course-details">
          <span><i class="fas fa-clock"></i> ${course.registrationOpen ? "Registration : Open" : "Registration : Closed"}</span>
        </div>
      </div>
      <div class="course-footer">
        <button class="btn btn-secondary view-details">View Details</button>
        <button class="btn btn-primary view-classes">View Classes</button>
      </div>
    `;

    courseCard
      .querySelector(".view-details")
      .addEventListener("click", () => viewDetails(course));
    courseCard
      .querySelector(".view-classes")
      .addEventListener("click", () => viewClasses(course));

    courseGrid.appendChild(courseCard);
  });
}

const courseDD = document.querySelector("#category-filter");
courseDD.addEventListener("change", courseFilter);

function courseFilter() {
  const category = courseDD.value;
  const allCourses = JSON.parse(localStorage.courses);
  courseGrid.innerHTML = "";
  categorizedCourses = allCourses.filter(
    (course) => category === course.category
  );

  const filteredCourses = category === "all" ? allCourses : categorizedCourses;
  console.log(filteredCourses);

  filteredCourses.forEach((course) => {
    courseGrid.innerHTML += `
                    <div class="course-card">
                    <div class="course-header">
                        <h3>${course.code}</h3>
                        <span class="course-category">${course.category}</span>
                    </div>
                    <div class="course-content">
                        <h4>${course.name}</h4>
                        <p>${course.description}</p>
                        <div class="course-details">
                            <span><i class="fas fa-user"></i> Instructors : ${course.sections.reduce((sum, section) => sum + 1, 0)}</span>
                            <span><i class="fas fa-users"></i> Total Enrolled :  ${course.sections.reduce((sum, section) => sum + section.enrolled, 0)}</span>
                        </div>
                        <div class="course-details">
                            <span><i class="fas fa-clock"></i> ${course.registrationOpen ? "Registration : Open" : "Registration : Closed"}</span>
                        </div>
                        
                    </div>
                    <div class="course-footer">
                        <button onclick='viewDetails(${JSON.stringify(course)})'
                        class="btn btn-secondary">View Details</button>
                        <button onclick='viewClasses(${JSON.stringify(course)})' class="btn btn-primary">View Classes</button>
                    </div>
                </div>`;
  });
}

const searchBox = document.querySelector("#search-course");
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
    courseGrid.innerHTML += `
                    <div class="course-card">
                    <div class="course-header">
                        <h3>${course.code}</h3>
                        <span class="course-category">${course.category}</span>
                    </div>
                    <div class="course-content">
                        <h4>${course.name}</h4>
                        <p>${course.description}</p>
                        <div class="course-details">
                            <span><i class="fas fa-user"></i> Instructors : ${course.sections.reduce((sum, section) => sum + 1, 0)}</span>
                            <span><i class="fas fa-users"></i> Total Enrolled :  ${course.sections.reduce((sum, section) => sum + section.enrolled, 0)}</span>
                        </div>
                        <div class="course-details">
                            <span><i class="fas fa-clock"></i> ${course.registrationOpen ? "Registration : Open" : "Registration : Closed"}</span>
                        </div>
                        
                    </div>
                    <div class="course-footer">
                        <button onclick='viewDetails(${JSON.stringify(course)})'
                        class="btn btn-secondary">View Details</button>
                        <button onclick='viewClasses(${JSON.stringify(course)})' class="btn btn-primary">View Classes</button>
                    </div>
                </div>`;
  });
}

function viewDetails(course) {
  if (typeof course === "string") {
    course = JSON.parse(course);
  }

  const availableCourses = document.querySelector(".search-section");
  availableCourses.style.display = "none";
  courseGrid.style.display = "flex";
  courseGrid.style.flexDirection = "column";
  courseGrid.style.gap = "20rem";
  courseGrid.innerHTML = `
                <div class="extended-course-card">
                    <div class="course-header">
                        <h3>${course.code}</h3>
                        <span class="course-category">${course.category}</span>
                    </div>
                    <div class="course-content">
                        <h4>${course.name}</h4>
                        <p>${course.description}</p>
                        <!-- <p>${course.extraDescription}</p> -->

                        <div class="course-details">
                            <span><i class="fas fa-user"></i> Instructors :  ${course.sections.reduce((sum, section) => sum + 1, 0)}</span>
                            <span><i class="fas fa-users"></i> Total Enrolled :  ${course.sections.reduce((sum, section) => sum + section.enrolled, 0)}</span>
                        </div>
                        <div class="course-details">
                            <span><i class="fas fa-hourglass-start"></i> Credit : ${course.credits}</span>
                            <span><i class="fas fa-book-open"></i> Pre-requisites :  ${course.prerequisites.length != 0 ? course.prerequisites : "None"}</span>
                        </div>
                    </div>
                </div>
                `;
}

async function viewClasses(course) {
  console.log(course);
  const availableCourses = document.querySelector(".search-section");
  availableCourses.style.display = "none";
  courseGrid.innerHTML = "";
  course.sections.forEach(
    (section) =>
      (courseGrid.innerHTML += `
                    <div class="course-card">
                    <div class="course-header">
                        <h3>${course.name} - L${section.crn}</h3>
                        <span class="course-category">${course.category}</span>
                    </div>
                    <div class="course-content">
                        <h4>${course.name}</h4>
                        <p>${course.description}</p>
                        <div class="course-details">
                            <span><i class="fas fa-user"></i> ${section.instructor}</span>
                            <span><i class="fas fa-users"></i> ${section.enrolled}/30</span>
                        </div>
                        <div class="course-details">
                            <span><i class="fas fa-clock"></i> ${course.registrationOpen ? "Registration : Open" : "Registration : Closed"}</span>
                        </div>
                        
                    </div>
                    <div style="display: flex; justify-content: center;" class="course-footer">
                        <button onclick='registerSection(${JSON.stringify(course)}, ${JSON.stringify(section)})' class="btn btn-primary">View Section</button>
                    </div>
                </div>`)
  );
}

function registerSection(course, section) {
  console.log("Working");
  courseGrid.style.display = "flex";
  console.log(section);

  courseGrid.style.flexDirection = "column";

  courseGrid.style.gap = "0.5rem";
  courseGrid.innerHTML = `
<div class="course-card">
                <div class="course-header">
                    <h3>${course.name} - L${section.crn}</h3>
                    <span class="course-category">${course.category}</span>
                </div>
                <div class="course-content">
                    <h4>${course.name}</h4>
                    <p>${course.description}</p>
                    <div class="course-details">
                        <span><i class="fas fa-user"></i> ${section.instructor}</span>
                        <span><i class="fas fa-users"></i> ${section.enrolled}/30</span>
                    </div>
                    <div class="course-details">
                        <span><i class="fas fa-clock"></i> ${course.registrationOpen ? "Registration : Open" : "Registration : Closed"}</span>
                    </div>
                    
                </div>
            </div>

             <!-- <div class="extended-course-card">
                <div class="course-content">
                    <h4>Requirements</h4>
                    <i class="fa-solid fa-check"></i> Pre-Requisites : ${course.prerequisites.length != 0 ? course.prerequisites : "None"} <br>
                    <i class="fa-solid fa-check"></i> Pre-Requisites : ${course.registrationOpen ? "Registration Open" : "Registration Closed"} <br>
                    <i class="fa-solid fa-xmark"></i> Pre-Requisites : ${course.registrationOpen ? "Registration Open" : "Registration Closed"} <br>
            </div> -->
            </div>
            <button onclick='register(${JSON.stringify(course)}, ${JSON.stringify(section)})' class="course-card">
                <div class="register-button" style="display: flex; justify-content: center; align-items: center; text-align: center; height: 50px;">
                    Register 
                </div>
            </button>

            `;
}

function register(course, section) {
  const studentInfo = JSON.parse(localStorage.currUserInfo);
  const studentCourses = studentInfo.courses;

  const completedCourse = studentCourses
    .filter((course) => course.status === "completed")
    .map((course) => course.courseId);

  const studentAttemptCourses = studentCourses.map((course) => course.courseId);

  if (studentAttemptCourses.includes(course.id)) {
    alert("This course is already present in your courses");
    return;
  }
  if (
    completedCourse.includes(!course.prerequisites) ||
    course.prerequisites.length !== 0
  ) {
    alert(
      `Unable to register, you have pending prerequisites ${course.prerequisites}`
    );
    return;
  }
  if (section.enrolled == section.capacity) {
    alert("Unable to register, section is full");
    return;
  } else {
    alert("Course has been registered");
  }
  //Have to push into courses.json (Increase of student) and students.json (Increase of course)
}

function logout() {
  window.location.href = "login.html";
  localStorage.clear();
}
