import React, { useEffect, useState } from "react";

export default function Notifications() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        const newAlerts = [];

        data.forEach(item => {
          // Expiry warning (within 7 days)
          if (item.expiryDate) {
            const expiry = new Date(item.expiryDate);
            const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) {
              newAlerts.push(`${item.name} at ${item.place} is expiring in ${diffDays} days`);
            }
          }

          // Low stock warning
          if (item.quantity < 20) {
            newAlerts.push(`${item.name} at ${item.place} has low stock (${item.quantity})`);
          }
        });

        setAlerts(newAlerts);
      })
      .catch(err => console.error("Failed to load notifications:", err));
  }, []);

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
      <h2 className="text-lg font-bold text-yellow-700 mb-2">Smart Notifications</h2>
      {alerts.length === 0 ? (
        <p className="text-gray-600">No alerts at the moment</p>
      ) : (
        <ul className="list-disc pl-5 space-y-1">
          {alerts.map((alert, idx) => (
            <li key={idx} className="text-gray-800">{alert}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
