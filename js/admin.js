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

let courses = "";
let students = "";

// For modifying JSON
let courseList = "";
let studentList = "";

let currentButton = "";

logoutButton.addEventListener("click", logout);

async function fetchData() {
  // const coursesJSON = await fetch("../data/courses.json");
  const coursesJSON = await fetch("http://localhost:3000/api/courses");
  courseList = await coursesJSON.json();
  localStorage.courses = JSON.stringify(courseList);  

  const studentsJSON = await fetch("http://localhost:3000/api/students");
  studentList = await studentsJSON.json();
  localStorage.students = JSON.stringify(studentList);

  courses = JSON.parse(localStorage.courses);
  students = JSON.parse(localStorage.students);

  start();
}

async function start() {
  if (currentButton != "") {
    currentButton.classList.remove("active");
  }
  console.log("Here1");
  
  progressButton.classList.add("active");
  currentButton = progressButton;

  const adminName = document.querySelector(".header-username");
  const totalCourses = document.querySelector("#total-courses");
  const totalStudents = document.querySelector("#total-students");
  const totalSections = document.querySelector("#total-classes");

  const currUserName = JSON.parse(localStorage.getItem("currUserInfo"));
  console.log("Here2");

  adminName.innerHTML = `<div class="user-info">
                <span>Welcome, <strong>${currUserName.username}</strong></span></div>`;
  totalCourses.innerHTML = `${courses.length}`;
  totalStudents.innerHTML = `${students.length}`;
  totalSections.innerHTML = courses.reduce((total, course) => {
    return total + course.sections.length;
  }, 0);

  adminCourseContainer.innerHTML = ``;
  console.log(courses);
  
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
  console.log("Here3");

}

function logout() {
  window.location.href = "../index.html";
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

  if (currentButton == openButton) {
    const courseCategorizing = allCourses.filter(
      (course) => course.registrationOpen === true
    );

    const categorizedCourses = courseCategorizing.filter(
      (course) => category === course.category
    );

    const filteredCourses =
      category === "all" ? courseCategorizing : categorizedCourses;
    console.log(filteredCourses);

    courseGrid.innerHTML = "";
    filteredCourses.forEach((course) => {
      courseGrid.innerHTML += generateOpenCourseCard(course);

      const sectionContainer =
        courseGrid.lastElementChild.querySelector(".class-list");

      for (const section of course.sections) {
        sectionContainer.innerHTML += generateSectionCard(section);
      }
    });
  }
  if (currentButton == allCourseButton) {
    categorizedCourses = allCourses.filter(
      (course) => category === course.category
    );

    const filteredCourses =
      category === "all" ? allCourses : categorizedCourses;
    console.log(filteredCourses);

    courseGrid.innerHTML = "";
    filteredCourses.forEach((course) => {
      courseGrid.innerHTML += generateOpenCourseCard(course);

      const sectionContainer =
        courseGrid.lastElementChild.querySelector(".class-list");

      for (const section of course.sections) {
        sectionContainer.innerHTML += generateSectionCard(section);
      }
    });
  } else {
    const courseCategorizing = allCourses.filter(
      (course) => course.registrationOpen === false
    );

    const categorizedCourses = courseCategorizing.filter(
      (course) => category === course.category
    );

    const filteredCourses =
      category === "all" ? courseCategorizing : categorizedCourses;
    console.log(filteredCourses);

    courseGrid.innerHTML = "";
    filteredCourses.forEach((course) => {
      courseGrid.innerHTML += generateOpenCourseCard(course);

      const sectionContainer =
        courseGrid.lastElementChild.querySelector(".class-list");

      for (const section of course.sections) {
        sectionContainer.innerHTML += generateSectionCard(section);
      }
    });
  }
}

const searchBox = document.querySelector(".search-input");
searchBox.addEventListener("input", searchCourses);

function searchCourses() {
  const allCourses = JSON.parse(localStorage.courses);
  const searchingCourse = searchBox.value.trim().toLowerCase();
  console.log(searchingCourse);

  if (currentButton == openButton) {
    const filteredCourses = allCourses.filter(
      (course) => course.registrationOpen === true
    );

    const filteredCourseList = filteredCourses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchingCourse) ||
        course.code.toLowerCase().includes(searchingCourse)
    );

    courseGrid.innerHTML = "";
    filteredCourseList.forEach((course) => {
      courseGrid.innerHTML += generateOpenCourseCard(course);

      const sectionContainer =
        courseGrid.lastElementChild.querySelector(".class-list");

      for (const section of course.sections) {
        sectionContainer.innerHTML += generateSectionCard(section);
      }
    });
  }
  if (currentButton == allCourses) {
    const filteredCourses = allCourses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchingCourse) ||
        course.code.toLowerCase().includes(searchingCourse)
    );
    console.log(filteredCourses);
    courseGrid.innerHTML = "";
    filteredCourses.forEach((course) => {
      courseGrid.innerHTML = "";
      filteredCourseList.forEach((course) => {
        courseGrid.innerHTML += generateOpenCourseCard(course);

        const sectionContainer =
          courseGrid.lastElementChild.querySelector(".class-list");

        for (const section of course.sections) {
          sectionContainer.innerHTML += generateSectionCard(section);
        }
      });
    });
  } else {
    const filteredCourses = allCourses.filter(
      (course) => course.registrationOpen === false
    );

    const filteredCourseList = filteredCourses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchingCourse) ||
        course.code.toLowerCase().includes(searchingCourse)
    );

    courseGrid.innerHTML = "";
    filteredCourseList.forEach((course) => {
      courseGrid.innerHTML += generateOpenCourseCard(course);

      const sectionContainer =
        courseGrid.lastElementChild.querySelector(".class-list");

      for (const section of course.sections) {
        sectionContainer.innerHTML += generateSectionCard(section);
      }
    });
  }
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
          <button onclick='manageClasses(${JSON.stringify(course)})' class="btn btn-primary btn-small">Manage Classes</button>
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
                            <span><i class="fas fa-clock"></i> ${course.registrationOpen ? "Registration : Open" : "Registration : Closed"}</span>
                            <span><i class="fas fa-users"></i> ${section.schedule}</span>

                        </div>
                        
                    </div>
                    <div style="display: flex; justify-content: center;" class="course-footer">
                        <button onclick='validateSection(${JSON.stringify(course)}, ${JSON.stringify(section)}, this)' class="btn btn-primary">Validate Section</button>
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
  adminCourseContainer.innerHTML = ``;
  for (const section of course.sections) {
    if (section.status == "open") {
      console.log(section);
      console.log(section.status);
      adminCourseContainer.innerHTML += generateValidateCourseCard(
        course,
        section
      );
    }
  }
}

function validateSection(validatedCourse, validatedSection, button) {
  alert("Class has been validated");
  button.style.backgroundColor = "green";
  button.style.cursor = "not-allowed";
  button.disabled = true;
  button.innerText = "Class Validated";
  console.log(button);

  validatedSection.status = "close";

  console.log(courseList);
  for (const course of courseList) {
    console.log(course);
    if (course.id == validatedCourse.id) {
      for (const section of course.sections) {
        console.log(section);
        if (section.crn == validatedSection.crn) {
          section.status = "close";
          return;
        }
      }
    }
  }
}
