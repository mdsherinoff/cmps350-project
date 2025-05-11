import React from "react";
import { Bar } from "react-chartjs-2";

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
  studentsPerYear: {
    labels: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
    data: [120, 150, 130, 110, 90],
  },
  studentsPerCategory: {
    labels: [
      "Programming",
      "Mathematics",
      "Systems",
      "Web & Data",
      "Software Engineering",
      "AI & Advanced Tech",
    ],
    data: [250, 180, 150, 200, 170, 140],
  },
};

export default function StudentReport() {
  const yearChartData = {
    labels: sampleData.studentsPerYear.labels,
    datasets: [
      {
        label: "Number of Students",
        data: sampleData.studentsPerYear.data,
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

  return (
    <div>
      <section className="Graphsgrid" />
      <div className="graphContainer">
        <div className="content">
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stats-card">
                <h3>Total Instructors per Year</h3>
                <div style={{ height: "300px" }}>
                  <Bar data={yearChartData} options={yearChartOptions} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
