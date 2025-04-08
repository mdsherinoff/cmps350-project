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
  const adminCourseContainer = document.querySelector(".courses-grid");

  console.log(adminCourseContainer);


  const currUserName = JSON.parse(localStorage.getItem("currUserInfo"));
  const courses = JSON.parse(localStorage.courses);
  const students = JSON.parse(localStorage.students);

  instructorName.innerHTML = `<div class="user-info">
                <span>Welcome, <strong>${currUserName.username}</strong></span></div>`;
  totalCourses.innerHTML = `${courses.length}`;
  totalStudents.innerHTML = `${students.length}`;

  for(const course of courses){
    if(course.registrationOpen === false){
      adminCourseContainer.innerHTML += `<div class="admin-course-card">
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
          <button class="btn btn-secondary btn-small">View Details</button>
          <button class="btn btn-primary btn-small">Manage Classes</button>
      </div>
  </div>
`
const sectionContainer = document.querySelector(".class-list");
for(section of course.sections){
  console.log(section);
  
  sectionContainer.innerHTML +=   `<div class="class-item">
                                      <div class="class-details">
                                          <span class="instructor">Dr. Ameen Mansour</span>
                                          <span class="schedule">Sun/Tue 8:00-9:30</span>
                                      </div>
                                      <div class="class-enrollment">
                                          <span>28/30</span>
                                      </div>
                                  </div>`     
}
}    
     
}


   
  

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
