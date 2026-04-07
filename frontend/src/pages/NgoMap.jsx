import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to center map on user's location
function LocationMarker() {
  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);
  return null;
}

function NgoMap() {
    const [donations, setDonations] = useState([]);

    useEffect(() => { fetchDonations(); }, []);

    const fetchDonations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/inventory');
            // Show both Available and Reserved items
            setDonations(res.data.filter(item => item.status !== 'Picked Up'));
        } catch (error) { console.error("Error fetching map data", error); }
    };

    const reserveItem = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/inventory/${id}/reserve`);
            fetchDonations(); 
        } catch (error) { console.error("Error reserving item", error); }
    };

    const pickupItem = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/inventory/${id}/pickup`);
            alert("Pickup confirmed! Thank you for reducing waste.");
            fetchDonations(); // This will remove the item from the map entirely
        } catch (error) { console.error("Error picking up item", error); }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-6 text-center">
                <h1 className="text-4xl font-bold text-blue-600">NGO Operations Map</h1>
                <p className="text-gray-600">Locate, reserve, and pick up local food surplus</p>
            </header>

            <div className="max-w-6xl mx-auto bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div style={{ height: '600px', width: '100%' }}>
                    <MapContainer center={[28.6139, 77.2090]} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 10 }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker />
                        
                        {donations.map((item) => (
                            <Marker key={item._id} position={[item.location.lat, item.location.lng]}>
                                <Popup>
                                    <div className="text-center p-2 min-w-[150px]">
                                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                                        <div className="text-sm text-gray-600 mb-2">
                                            <p>Qty: {item.quantity}</p>
                                            <p className="text-red-500">Exp: {new Date(item.expiryDate).toLocaleDateString()}</p>
                                        </div>
                                        
                                        {item.status === 'Available' ? (
                                            <button onClick={() => reserveItem(item._id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-semibold w-full transition">
                                                Reserve Now
                                            </button>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="bg-yellow-100 text-yellow-800 text-xs py-1 rounded font-bold border border-yellow-300">
                                                    Currently Reserved
                                                </div>
                                                <button onClick={() => pickupItem(item._id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm font-semibold w-full transition shadow-md">
                                                    Confirm Pickup
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default NgoMap;