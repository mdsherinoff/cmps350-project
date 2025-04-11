document.addEventListener("DOMContentLoaded", fetchData);



async function fetchData() {
    const coursesJSON = await fetch("../data/courses.json");
    // const courses = await fetch("http://localhost:3000/api/courses");
    courseList = await coursesJSON.json();
    localStorage.courses = JSON.stringify(courseList);
  
    const studentsJSON = await fetch("../data/students.json");
    studentList = await studentsJSON.json();
    localStorage.students = JSON.stringify(studentList);
  
    courses = JSON.parse(localStorage.courses);
    students = JSON.parse(localStorage.students);
  
    start();
  }