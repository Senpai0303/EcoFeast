import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

function AutoZoom({ location }) {
  const map = useMap();
  if (location) {
    map.setView([location.lat, location.lng], 14);
  }
  return null;
}

export default function NgoMap() {
  const [items, setItems] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleSearch = () => {
    const item = items.find(
      i =>
        i.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (item) {
      setSelectedLocation(item.location);
    } else {
      alert("No matching location found");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-600">NGO Map Portal</h1>

      {/* Dropdown */}
      <select
        onChange={(e) => {
          const item = items.find(i => i.place === e.target.value);
          if (item) setSelectedLocation(item.location);
        }}
        className="border px-4 py-2 rounded"
      >
        <option value="">Select a location</option>
        {items.map(item => (
          <option key={item._id} value={item.place}>{item.place}</option>
        ))}
      </select>

      {/* Search box */}
      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          placeholder="Search by place or item..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Map */}
      <MapContainer center={[30.3165, 78.0322]} zoom={12} style={{ height: "500px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {selectedLocation && <AutoZoom location={selectedLocation} />}
        {items.map(item => (
          <Marker key={item._id} position={[item.location.lat, item.location.lng]}>
            <Popup>
              <strong>{item.name}</strong> <br />
              {item.place}, {item.district}, {item.state}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
