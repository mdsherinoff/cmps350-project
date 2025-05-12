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
    labels: [
      "Systems",
      "Mathematics",
      "AI & Advanced Tech",
      "Programming",
      "Software Engineering",
      "Web & Data",
    ],
  },
};

export default function StudentReport({ courses }) {

    const courseWithMostAs = courses.coursesWithMostAs;


  const yearChartData = {
    labels: sampleData.studentYears.labels,
    datasets: [
      {
        label: "Number of Courses",
        data: courses.coursesByCategory.map((d) => d._count.courseUId),

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
        text: "Number of courses by category",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Courses",
        },
      },
      x: {
        title: {
          display: true,
          text: "Category",
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
                      {courses.totalCourses}
                    </span>
                    <span className="stat-label">Total Courses</span>
                  </div>
                </div>
              </div>
              <div className="stats-card">
                <h3>Number of courses by category</h3>
                <div style={{ height: "300px" }}>
                  <Bar data={yearChartData} options={yearChartOptions} />
                </div>
              </div>


          <div className="stats-card">
            <h3>Courses with Most A's</h3>
            {courseWithMostAs.map((course) => (
              <div key={course.courseUId} className="stat-label">
                {course.name}
              </div>
            ))}
          </div>

            </div>

          </section>
        </div>
      </div>
    </div>
  );
}
