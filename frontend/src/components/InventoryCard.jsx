import React from "react";

export default function InventoryCard({ item, onReserve, onPickup }) {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col justify-between">
      {/* Item Info */}
      <div>
        <h2 className="text-lg font-bold text-green-700">{item.name}</h2>
        <p className="text-gray-600">Quantity: {item.quantity}</p>
        <p className="text-gray-600">Location: {item.place}, {item.district}, {item.state}</p>

        {/* Status */}
        {item.status && (
          <p className="mt-2 text-sm font-semibold text-blue-600">
            Status: {item.status}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onReserve(item._id)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
        >
          Reserve
        </button>
        <button
          onClick={() => onPickup(item._id)}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
        >
          Pick Up
        </button>
      </div>
    </div>
  );
}
