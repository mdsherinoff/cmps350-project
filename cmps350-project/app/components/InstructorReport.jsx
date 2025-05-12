import React from "react";
import { Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";
import { faChalkboardUser } from "@fortawesome/free-solid-svg-icons";
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
import { icon } from "@fortawesome/fontawesome-svg-core";

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
    labels: [
      "Computer Engineering",
      "Computer Science",
      "Information Security",
      "Mathematics",
      "Software Engineering",
    ],
  },
};

export default function StudentReport({ instructors }) {
  const yearChartData = {
    labels: sampleData.studentYears.labels,
    datasets: [
      {
        label: "Number of Instructors",
        data: instructors.instructorsByDepartment
          .map((d) => ({
            key: d.department,
            value: d._count.instructorUId,
          }))
          .map((d) => d.value),
        backgroundColor: "rgba(112, 25, 61, 0.8)",
      },
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
        text: "Number of instructors by department",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Instructors",
        },
      },
      x: {
        title: {
          display: true,
          text: "Department",
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
                      {instructors.totalInstructors}
                    </span>
                    <span className="stat-label">Total Instructors</span>
                  </div>
                </div>
              </div>
              <div className="stats-card">
                <h3>Number of instructors by department</h3>
                <div style={{ height: "300px" }}>
                  <Bar data={yearChartData} options={yearChartOptions} />
                </div>
              </div>

              <div className="stats-card">
                <h3>Instructor(s) with the most sections taught</h3>
                <div className="GPAContainer">
                  <FontAwesomeIcon icon={faChalkboardUser} size="3x" />
                  <FontAwesomeIcon icon="fa-solid fa-chalkboard-user" />
                  {instructors.instructorsWithMostSections.map((instructor) => (
                    <span
                      key={instructor.instructorUId}
                      className="stat-label2"
                    >
                      {instructor.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faSquarePollVertical} size="5x" />
              </div>
              <div className="stat-info">
                <span className="stat-value" id="total-classes">
                  {instructors.instructorsWithNoSections}
                </span>
                <span className="stat-label">Instructors with No Section</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
