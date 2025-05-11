"use client";

import React, { useEffect, useState } from "react";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faSquarePollVertical, faTachometer, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import StudentReport from "../components/StudentReport";
import InstructorReport from "../components/InstructorReport";
import CourseReport from "../components/CourseReport";



export default function informationPage() {

const [selectedTab, setSelectedTab] = useState("Student");
  

  return (
    <>

      <div>
        <header className="main-header">
          <div className="header-left">
            <img
              src="../images/logo qu.png"
              alt="Qatar University Logo"
              className="small-logo"
            />
            <h1>CSE Department Administration</h1>
          </div>
          <div className="header-right">
            <div className="header-username"></div>
            <button className="btn btn-logout">Logout</button>
          </div>
        </header>

        <div className="container">
          
          <nav className="sidebar">
            <ul className="nav-menu">
              <li className="nav-item active">
              <a href="html/admin-home.html" className="nav-link">
                <FontAwesomeIcon icon={faTachometerAlt}size="1x" className="nav-icon"/>
                <span>Dashboard</span>
              </a>
              </li>
              <li className="nav-item">
                <a href="html/admin-schedule.html" className="nav-link">
                <FontAwesomeIcon icon={faCalendar}size="1x" className="nav-icon"/>
                <span>Schedule</span>
              </a>
              </li>
                <li className="nav-item">
                <a href="/informationPage" className="nav-link">
                <FontAwesomeIcon icon={faSquarePollVertical}size="1x" className="nav-icon"/>
                <span>Course Statistics</span>
                
              </a>
              </li>
            </ul>
          </nav>

          <div className="content">
                <section className="search-section">
                  <h2>Course Statistics</h2>
                </section>
                  <div className="tab-controls">
                    <div className="search-filter">
                        <select onChange={(e) => setSelectedTab(e.target.value)} className="category-filter">
                            <option value="Student">Student</option>
                            <option value="Instructor">Instructor</option>
                            <option value="Courses">Courses</option>
                        </select>
                    </div>
                </div>

            <section className="Graphsgrid" />
            {selectedTab === "Student" && <StudentReport/>}
            {selectedTab === "Instructor" && <InstructorReport/>}
            {selectedTab === "Courses" && <CourseReport/>}
            <section/>
          </div>
        </div>
      </div>
    </>
  );
}
