const BASE_URL = 'http://127.0.0.1:3000/cmps350-project/home.html'
const currentStudentId = JSON.parse(localStorage.getItem("user"))

const gradePointDictionary = {
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "D-": 0.7,
    "F": 0.0
  };

document.addEventListener("DOMContentLoaded",fetchData)
const learningPathGrid = document.querySelector(".course-path-grid")
const progressContainer = document.querySelector(".progress-stats")
const currentCoursesContainer = document.querySelector(".current-courses")
const completedCoursesContainer = document.querySelector(".completed-courses")

const logoutButton = document.querySelector(".btn-logout")

logoutButton.addEventListener('click',logout)


async function fetchData(){
    const courses = await fetch("../data/courses.json");
    let courseList = await courses.json();
    localStorage.courses = JSON.stringify(courseList)

    const students = await fetch("../data/students.json");
    let studentList = await students.json();
    localStorage.students = JSON.stringify(studentList)
    
    start()
}

async function start(){
    
    const courses = JSON.parse(localStorage.courses)

    //Comment from here
    const students = JSON.parse(localStorage.students)
    const student = students.find(student => String(student.id) == currentStudentId)
    
    const studentCourses = student.courses;
    console.log(studentCourses);
    
    for(const course1 of courses){
        const courseInStudent = studentCourses.find(course2 => course2.courseId === course1.id);

        if(courseInStudent) {
            console.log(course1);
            
            if(courseInStudent.status === "completed") {
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
        }
        else{
            learningPathGrid.innerHTML += `
            <div class="course-box pending-course">
                ${course1.code}
            </div>`;
        }
    }
    
    //Till Here



    // courses.forEach(course => learningPathGrid.innerHTML += `
    //                             <!-- Course begin here -->
    //                              <!-- Year 1 -->
    //                             <div class="course-box">
    //                                 ${course.code}
    //                             </div>`)
    loadProgramProgress()
}

async function loadProgramProgress(){

        const studentList = JSON.parse(localStorage.students)            
        const student = studentList.find(student => String(student.id) == currentStudentId)
        console.log(student);

        const completedCourses = student.courses.filter(course => course.status == "completed")
        const grades = completedCourses.map(course => course.grade)
        let gradePoints = 0;

        for (const course of completedCourses) {
            if (gradePointDictionary[course.grade] !== undefined) {
                gradePoints += gradePointDictionary[course.grade];
            }
        }
        console.log(gradePoints);

        progressContainer.innerHTML = `<div class="stat-item">
        <span class="stat-label">Completed Courses:</span>
        <span class="stat-value" id="completed-courses">${completedCourses.length}/20</span>
        </div>
        <div class="stat-item">
        <span class="stat-label">Credits Earned:</span>
        <span class="stat-value" id="credits-earned">${(completedCourses.length)*3}/100</span>
        </div>
        <div class="stat-item">
        <span class="stat-label">Current GPA:</span>
        <span class="stat-value" id="current-gpa">${gradePoints/completedCourses.length}</span>
        </div>`  
        
        const currentCourses = student.courses.filter(course => course.status == "current")
        
        console.log(currentCourses);
        const courseList = JSON.parse(localStorage.courses)
        console.log(courseList);

        for(course1 of courseList){
            for(course2 of currentCourses)
            {
                if(course1.id == course2.courseId){
                    currentCoursesContainer.innerHTML += `
                    <div class="semester-course">
                    <span class="course-code">${course1.code}</span>
                    <span class="course-name">${course1.name}</span>
                    <span class="course-status in-progress">In Progress</span>
                    </div>`
                    }
                }
            }

            for(course1 of courseList){
                for(course2 of completedCourses)
                {
                    if(course1.id == course2.courseId){
                        completedCoursesContainer.innerHTML += `
                        <div class="semester-course">
                        <span class="course-code">${course1.code}</span>
                        <span class="course-name">${course1.name}</span>
                        <span class="course-status completed">${course2.grade}</span>
                        </div>`
                        }
                    }
                }
        }

function logout(){
    window.location.href = "login.html";
    localStorage.clear()
}


    

// #28a745
// #ffc107
// #355c7d
