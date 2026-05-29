import React from "react";
import { Link } from "react-router-dom";
import Notifications from "../components/Notifications";

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-green-700">EcoFeast Dashboard</h1>
      <p className="text-gray-600">
        Welcome to EcoFeast! Use the links below to explore donor features,
        NGO mapping, and analytics.
      </p>

      {/* Smart Notifications */}
      <Notifications />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Donor Dashboard Card */}
        <div className="bg-white shadow rounded p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Donor Dashboard</h2>
          <p className="text-gray-500 mb-4">
            Add food items manually with location details and view your inventory.
          </p>
          <Link
            to="/donor"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Go to Donor Dashboard
          </Link>
        </div>

        {/* NGO Map Card */}
        <div className="bg-white shadow rounded p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">NGO Map</h2>
          <p className="text-gray-500 mb-4">
            Search or select a location to auto‑zoom and view nearby donations.
          </p>
          <Link
            to="/ngomap"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to NGO Map
          </Link>
        </div>

        {/* Analytics Card */}
        <div className="bg-white shadow rounded p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Analytics</h2>
          <p className="text-gray-500 mb-4">
            Visualize donation trends with bar and line charts.
          </p>
          <Link
            to="/analytics"
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Go to Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
