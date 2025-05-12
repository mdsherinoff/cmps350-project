import React from "react";
import { Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";
import { faSquareReddit } from "@fortawesome/free-brands-svg-icons";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const sampleData = {
  studentYears: {
    labels: ["Freshman", "Sophomore", "Junior", "Senior"],
  },
};

export default function StudentReport({ students }) {
  //   const studentCount = students.totalStudents;

  const topGpaStudents = students.topStudentsByGPA;

  const yearChartData = {
    labels: sampleData.studentYears.labels,
    datasets: [
      {
        label: "Number of Students",
        data: students.studentsByYear.map((y) => y._count.studentUId),
        if (students.studentsByYear == "Freshman"){
                  backgroundColor: "rgba(112, 25, 61, 0.8)"}
        else if (students.studentsByYear == "Sophomore"){
                  backgroundColor: "rgba(155, 80, 112, 0.8)"}
        else if (students.studentsByYear == "Junior"){
                  backgroundColor: "rgba(177, 102, 133, 0.8)"}
        else if (students.studentsByYear == "Senior"){
                  backgroundColor: "rgba(238, 13, 107, 0.8)"}
        }
      ,
    ],
  };

  const yearChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Student Distribution by Year",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Students",
        },
      },
      x: {
        title: {
          display: true,
          text: "Academic Year",
        },
      },
    },
  };
  //   console.log(studentCount);

  return (
    <div>
      <section className="Graphsgrid" />
      <div className="graphContainer">
        <div className="content">
          <section className="stats-section">
            <div className="analytics-grid">
              <div className="stat-container">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FontAwesomeIcon icon={faSquarePollVertical} size="5x" />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value" id="total-classes">
                      {students.totalStudents}
                    </span>
                    <span className="stat-label">Total Students</span>
                  </div>
                </div>
              </div>
              <div className="stats-card">
                <h3>Number of students per academic year</h3>
                <div style={{ height: "300px" }}>
                  <Bar data={yearChartData} options={yearChartOptions} />
                </div>
              </div>

              <div className="stats-card">
                <h3>Top 5 Students By GPA</h3>
                <div className="GPAContainer">
                  {topGpaStudents.map((student) => (
                    <span key={student.studentUId} className="stat-label">
                      {student.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
