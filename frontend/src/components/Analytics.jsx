import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-gray-600">No inventory data available</p>;
  }

  const barData = {
    labels: items.map(i => i.name),
    datasets: [
      {
        label: "Quantity",
        data: items.map(i => i.quantity),
        backgroundColor: "rgba(75,192,192,0.6)"
      }
    ]
  };

  const lineData = {
    labels: items.map(i => new Date(i.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Donations Over Time",
        data: items.map(i => i.quantity),
        borderColor: "rgba(59,130,246,0.8)",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.3
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-bold mb-4">Inventory Quantities</h2>
        <Bar data={barData} />
      </div>
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-bold mb-4">Donation Trends</h2>
        <Line data={lineData} />
      </div>
    </div>
  );
}
