import React, { useEffect, useState } from "react";
import Analytics from "../components/Analytics";

export default function AnalyticsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Failed to load analytics data:", err));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-600">Donation Analytics</h1>
      <Analytics items={items} />
    </div>
  );
}
