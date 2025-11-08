import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

export default function LiveChart({ labels = [], pH = [], turbidity = [] }) {
  const data = {
    labels,
    datasets: [
      {
        label: "pH",
        data: pH,
        yAxisID: "y1",
        borderColor: "#16a34a", // green line
        backgroundColor: "rgba(22,163,74,0.2)",
        tension: 0.35, // smooth line
        fill: true,
      },
      {
        label: "Turbidity",
        data: turbidity,
        yAxisID: "y2",
        borderColor: "#3b82f6", // blue line
        backgroundColor: "rgba(59,130,246,0.2)",
        borderDash: [4, 4],
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeInOutQuad",
    },
    plugins: {
      legend: { position: "top", labels: { color: "#94a3b8" } },
      title: {
        display: true,
        text: "Water Quality Trends",
        color: "#e2e8f0",
        font: { size: 18 },
      },
    },
    interaction: { mode: "index", intersect: false },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y1: {
        type: "linear",
        position: "left",
        title: { display: true, text: "pH", color: "#16a34a" },
        ticks: { color: "#16a34a" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y2: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Turbidity (NTU)", color: "#3b82f6" },
        ticks: { color: "#3b82f6" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: 950, height: 300 }}>
      <Line data={data} options={options} />
    </div>
  );
}
