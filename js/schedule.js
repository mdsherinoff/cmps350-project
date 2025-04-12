

document.addEventListener("DOMContentLoaded", fetchData);

const scheduleGrid = document.querySelector(".schedule-grid");
const logoutButton = document.querySelector(".btn-logout");

const allButton = document.querySelector("#all-days-button");
const specificButton = document.querySelector("#specific-days-button");


const daysDD = document.querySelector(".days-filter");
daysDD.addEventListener("click",dayscourseFilter);


allButton.addEventListener("click", start);
specificButton.addEventListener("click", specifics);

let courses = "";
let students = "";

let courseList = "";
let studentList = "";

let daylist = "";

let currentButton = "";

async function fetchData() {
  // const coursesJSON = await fetch("../data/courses.json");
  const coursesJSON = await fetch("http://localhost:3000/api/courses");

  courseList = await coursesJSON.json();
  courseList = courseList.filter(
    (course) => course.registrationOpen === false
  );

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

  scheduleGrid.innerHTML = ``;

  daysDD.selectedIndex = 0;

  const adminName = document.querySelector(".header-username");

  const currUserName = JSON.parse(localStorage.getItem("currUserInfo"));
  console.log(`${currUserName.username}`);
  adminName.innerHTML = `<div class="user-info">
                <span>Welcome, <strong>${currUserName.username}</strong></span></div>`;


  // scheduleGrid.innerHTML += `<h4 style="color: red">Please note there's no class on Saturday and Sunday !!!</h5>`;
  scheduleGrid.innerHTML += `<h3>Monday</h3>`;
  
  for (const course of courses) {
    for (const section of course.sections) {
      if (section.schedule.toLowerCase().includes("mon")){
        scheduleGrid.innerHTML += generateScheduleCard(course);
      }
    }
    }

  scheduleGrid.innerHTML += `<h3>Tuesday</h3>`;
  
  for (const course of courses) {
    for (const section of course.sections) {
      if (section.schedule.toLowerCase().includes("tue")){
        scheduleGrid.innerHTML += generateScheduleCard(course);
      }
    }
    }
  
  scheduleGrid.innerHTML += `<h3>Wednesday</h3>`;
  
  for (const course of courses) {
    for (const section of course.sections) {
      if (section.schedule.toLowerCase().includes("wed")){
        scheduleGrid.innerHTML += generateScheduleCard(course);
      }
    }
    }
  
  scheduleGrid.innerHTML += `<h3>Thursday</h3>`;
  
  for (const course of courses) {
    for (const section of course.sections) {
      if (section.schedule.toLowerCase().includes("thu")){
        scheduleGrid.innerHTML += generateScheduleCard(course);
      }
    }
    }
    
  scheduleGrid.innerHTML += `<h3>Friday</h3>`;
  
  for (const course of courses) {
    for (const section of course.sections) {
      if (section.schedule.toLowerCase().includes("fri")){
        scheduleGrid.innerHTML += generateScheduleCard(course);
      }
    }
    } 
 
  
}

function specifics() {
  currentButton.classList.remove("active");
  specificButton.classList.add("active");
  currentButton = specificButton;

  scheduleGrid.innerHTML = ``;
  daysDD.selectedIndex = 2;
  
  for (const course of courses) {
    for (const section of course.sections) {
      if (section.schedule.toLowerCase().includes("mon")){
        scheduleGrid.innerHTML += generateScheduleCard(course);
      }
    } 
    }

}

const courseDD = document.querySelector(".category-filter");
courseDD.addEventListener("change", dayscourseFilter);

function dayscourseFilter() {

  scheduleGrid.innerHTML = ``;
  
  if (daysDD.selectedIndex == 0 && courseDD.selectedIndex == 0) {
    currentButton.classList.remove("active");
    allButton.classList.add("active");
    currentButton = allButton;
  }
  else {
    currentButton.classList.remove("active");
    specificButton.classList.add("active");
    currentButton = specificButton;
  };

  const category = courseDD.value;
  const day = daysDD.value;

  const allCourses = JSON.parse(localStorage.courses);
  
  const progressCourse = allCourses.filter( (course) => course.registrationOpen === false);

  const categorizedCourses = progressCourse.filter( (course) => category === course.category);

  const filteredCourses = category === 'all' ? progressCourse : categorizedCourses;

  scheduleGrid.innerHTML = ``;
  for (course of filteredCourses) {

    if (day == "all" && category == 'all') {
      start();
    }
    else {
      for (const section of course.sections) {
        if (section.schedule.toLowerCase().includes(day)){
          scheduleGrid.innerHTML += generateScheduleCard(course);
        }
      } 

    }
    
  }
}

function generateScheduleCard(course) {
  return `<div class="schedule-course-card">
        <div class="schedule-course-name">
            <h3>${course.code}</h3>
            `;
}