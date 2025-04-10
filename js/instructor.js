document.addEventListener("DOMContentLoaded", function () {
  loadData();
  loadClasses();
  setupEventListeners();
});

async function loadData() {
  const courses = await fetch("../data/courses.json");
  let courseList = await courses.json();
  localStorage.courses = JSON.stringify(courseList);

  const studentsResponse = await fetch("../data/students.json");
  const students = await studentsResponse.json();
  localStorage.students = JSON.stringify(students);

  const currUser = JSON.parse(localStorage.getItem("currUserInfo"));
  const usernameDisplay = document.querySelector("#instructor-name");
  usernameDisplay.innerHTML = currUser.name;

  // Calculate dashboard statistics
  const totalClassesElement = document.querySelector("#total-classes");
  const totalStudentsElement = document.querySelector("#total-students");
  const gradedStudentsElement = document.querySelector("#graded-students");
  const pendingGradesElement = document.querySelector("#pending-grades");
  const instructorSections = currUser.sections || [];
  const totalClasses = instructorSections.length;
  let totalStudents = 0;
  let gradedStudents = 0;
  let pendingGrades = 0;
  for (const section of instructorSections) {
    const enrolledStudents = students.filter((student) =>
      student.courses.some((course) => course.crn === section.crn)
    );
    totalStudents += enrolledStudents.length;
    enrolledStudents.forEach((student) => {
      const courseEnrollment = student.courses.find(
        (course) => course.crn === section.crn
      );
      if (courseEnrollment && courseEnrollment.grade) {
        gradedStudents++;
      } else {
        pendingGrades++;
      }
    });
  }
  totalClassesElement.textContent = totalClasses;
  totalStudentsElement.textContent = totalStudents;
  gradedStudentsElement.textContent = gradedStudents;
  pendingGradesElement.textContent = pendingGrades;
}

function loadClasses() {
  const container = document.querySelector(".my-classes-section");
  const instructor = JSON.parse(localStorage.getItem("currUserInfo"));
  container.innerHTML = "";
  const coursesData = JSON.parse(localStorage.getItem("courses"));
  instructor.sections.forEach(async (instructorSection) => {
    // Find the corresponding course and section
    const course = findCourseBySection(coursesData, instructorSection.crn);
    const section = course.sections.find(
      (s) => s.crn === instructorSection.crn
    );
    const enrolledStudents = await getEnrolledStudents(instructorSection.crn);
    container.innerHTML += `
            <div class="class-card">
                <div class="class-header">
                    <div class="class-title">
                        <h3>${course.code}: ${course.name}</h3>
                        <span class="class-crn">CRN: ${section.crn}</span>
                    </div>
                    <div class="class-info">
                        <span class="class-schedule"><i class="fas fa-calendar-alt"></i> ${section.schedule}</span>
                        <span class="class-location"><i class="fas fa-map-marker-alt"></i> ${section.location}</span>
                        <span class="class-enrollment"><i class="fas fa-users"></i> ${section.enrolled}/${section.capacity} Students</span>
                    </div>
                </div>
                <div class="class-content">
                    <div class="class-description">
                        <p>${course.description}</p>
                    </div>
                    <div class="students-list-container">
                        <table class="students-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Current Grade</th>
                                    <th>Final Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${generateStudentRows(enrolledStudents)}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="class-footer">
                    <button class="btn btn-primary submit-grades" data-course-id="${course.id}" data-crn="${section.crn}" onclick="handleSubmit(event)">
                        Submit Grades
                    </button>
                </div>
            </div>
        `;
  });
}

function setupEventListeners() {
  const logoutButton = document.querySelector(".btn-logout");
  logoutButton.addEventListener("click", logout);

  const refreshButton = document.querySelector("#refreshClassesBtn");
  refreshButton.addEventListener("click", async () => {
    //loads the page again
    await loadData();
    await loadClasses();
  });

  function logout() {
    window.location.href = "index.html";
    localStorage.clear();
  }
}

// Helper functions
function findCourseBySection(coursesData, crn) {
  for (const course of coursesData) {
    const sectionMatch = course.sections.find((section) => section.crn === crn);
    if (sectionMatch) {
      return course;
    }
  }
  return null;
}

function generateStudentRows(students) {
  return students
    .map((student) => {
      return `
            <tr data-student-id="${student.id}">
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.currentGrade || ""}</td>
                <td>
                    <select class="grade-select">
                        <option value="">Select Grade</option>
                        <option value="A" ${student.finalGrade === "A" ? "selected" : ""}>A</option>
                        <option value="B" ${student.finalGrade === "B" ? "selected" : ""}>B</option>
                        <option value="C" ${student.finalGrade === "C" ? "selected" : ""}>C</option>
                        <option value="D" ${student.finalGrade === "D" ? "selected" : ""}>D</option>
                        <option value="F" ${student.finalGrade === "F" ? "selected" : ""}>F</option>
                    </select>
                </td>
            </tr>
        `;
    })
    .join("");
}

async function getEnrolledStudents(crn) {
  const response = await fetch("../data/students.json");
  const students = await response.json();

  const enrolledStudents = students.filter((student) =>
    student.courses.some((course) => course.crn === crn)
  );
  // Map to the format needed for your UI
  const formattedStudents = enrolledStudents.map((student) => {
    const courseEnrollment = student.courses.find(
      (course) => course.crn === crn
    );
    return {
      id: student.id,
      name: student.name,
      currentGrade: courseEnrollment.grade || "",
      finalGrade: "",
    };
  });
  return formattedStudents;
}

async function handleSubmit(event) {
  const button = event.target;
  const classCard = button.closest(".class-card");
  const courseId = button.dataset.courseId;
  const crn = button.dataset.crn;

  const gradeSelects = classCard.querySelectorAll(".grade-select");

  const grades = [];
  let hasEmptyGrades = false;

  gradeSelects.forEach((select) => {
    const grade = select.value;
    if (!grade) {
      hasEmptyGrades = true;
    }
    grades.push({
      studentId: select.closest("tr").dataset.studentId,
      grade: grade,
    });
  });

  if (hasEmptyGrades) {
    alert("Please assign grades to all students before submitting.");
    return;
  }

  const response = await fetch("../data/students.json");
  const students = await response.json();

  students.forEach((student) => {
    const studentGrade = grades.find((g) => g.studentId === student.id);
    if (studentGrade) {
      const courseIndex = student.courses.findIndex((c) => c.crn === crn);
      if (courseIndex !== -1) {
        student.courses[courseIndex].grade = studentGrade.grade;
      }
    }
  });

  fetch("http://localhost:3000/api/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(students),
  });

  // Update UI to show success
  button.textContent = "Grades Submitted";
  button.disabled = true;
  button.classList.add("btn-success");

  alert("Grades submitted successfully!");
}
