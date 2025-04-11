const BASE_URL = "http://127.0.0.1:3000/cmps350-project/home.html";
const currentStudentId = JSON.parse(localStorage.getItem("userId"));

const gradePointDictionary = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
};

document.addEventListener("DOMContentLoaded", fetchData);

const learningPathGrid = document.querySelector(".course-path-grid");
const progressContainer = document.querySelector(".progress-stats");
const currentCoursesContainer = document.querySelector(".current-courses");
const completedCoursesContainer = document.querySelector(".completed-courses");
const pendingCoursesContainer = document.querySelector(".pending-courses");
const studentName = document.querySelector(".header-username");
const logoutButton = document.querySelector(".btn-logout");

logoutButton.addEventListener("click", logout);

async function fetchData() {
  const courses = await fetch("http://localhost:3000/api/courses");
  let courseList = await courses.json();
  localStorage.courses = JSON.stringify(courseList);

  const students = await fetch("http://localhost:3000/api/students");
  let studentList = await students.json();
  localStorage.students = JSON.stringify(studentList);

  start();
}

async function start() {
  const courses = JSON.parse(localStorage.courses);

  const currUserName = JSON.parse(localStorage.getItem("currUserInfo"));
  studentName.innerHTML = `<div class="user-info">
                <span>Welcome, <strong>${currUserName.name}</strong></span></div>`;

  const students = JSON.parse(localStorage.students);
  const student = students.find(
    (student) => String(student.id) == currentStudentId
  );

  const studentCourses = student.courses;
  console.log(studentCourses);

  for (const course1 of courses) {
    const courseInStudent = studentCourses.find(
      (course2) => course2.courseId === course1.id
    );

    if (courseInStudent) {
      console.log(course1);

      if (courseInStudent.status === "completed") {
        learningPathGrid.innerHTML += `
                    <div class="course-box completed-course">
                        ${course1.code}
                    </div>`;
      } else {
        learningPathGrid.innerHTML += `
                    <div class="course-box progress-course">
                        ${course1.code}
                    </div>`;
      }
    } else {
      learningPathGrid.innerHTML += `
            <div class="course-box pending-course">
                ${course1.code}
            </div>`;
    }
  }

  loadProgramProgress();
}

async function loadProgramProgress() {
  const studentList = JSON.parse(localStorage.students);
  const student = studentList.find(
    (student) => String(student.id) == currentStudentId
  );

  const completedCourses = student.courses.filter(
    (course) => course.status == "completed"
  );

  let gradePoints = 0;

  for (const course of completedCourses) {
    if (gradePointDictionary[course.grade] !== undefined) {
      gradePoints += gradePointDictionary[course.grade];
    }
  }

  progressContainer.innerHTML = `<div class="stat-item">
        <span class="stat-label">Completed Courses:</span>
        <span class="stat-value" id="completed-courses">${completedCourses.length}/20</span>
        </div>
        <div class="stat-item">
        <span class="stat-label">Credits Earned:</span>
        <span class="stat-value" id="credits-earned">${completedCourses.length * 3}/100</span>
        </div>
        <div class="stat-item">
        <span class="stat-label">Current GPA:</span>
        <span class="stat-value" id="current-gpa">${(gradePoints / completedCourses.length).toFixed(2)}</span>
        </div>`;

  const courseList = JSON.parse(localStorage.courses);

  for (course1 of courseList) {
    let found = false;
    for (course2 of student.courses) {
      if (course1.id == course2.courseId) {
        found = true;
        if (course2.status == "completed") {
          completedCoursesContainer.innerHTML += `
                        <div class="semester-course">
                        <span class="course-code">${course1.code}</span>
                        <span class="course-name">${course1.name}</span>
                        <span class="course-status completed">${course2.grade}</span>
                        </div>`;
        } else {
          if (course2.status == "current") {
            currentCoursesContainer.innerHTML += `
                            <div class="semester-course">
                            <span class="course-code">${course1.code}</span>
                            <span class="course-name">${course1.name}</span>
                            <span class="course-status in-progress">In Progress</span>
                            </div>`;
          }
        }
      }
    }
    if (found == false) {
      pendingCoursesContainer.innerHTML += `
                    <div class="semester-course">
                    <span class="course-code">${course1.code}</span>
                    <span class="course-name">${course1.name}</span>
                    <span class="course-status pending">Pending</span>
                    </div>`;
    }
  }
}

function logout() {
  window.location.href = "../index.html";
  localStorage.clear();
}

// #28a745
// #ffc107
// #355c7d
