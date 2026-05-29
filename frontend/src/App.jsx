import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DonorDashboard from "./pages/DonorDashboard";
import NgoMap from "./pages/NgoMap";
import AnalyticsPage from "./pages/AnalyticsPage";
import Recipes from "./pages/Recipes";

export default function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (firebaseUser, role) => {
    setUser(firebaseUser);
    setUserRole(role);
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
  };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  return (
    <Router>
      <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          {userRole === "Donor" && <Link to="/donor">Donor Dashboard</Link>}
          {userRole === "NGO" && <Link to="/ngomap">NGO Map</Link>}
          <Link to="/analytics">Analytics</Link>
          <Link to="/recipes">Recipe Generator</Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Log Out
        </button>
      </nav>

      <Routes>
        {userRole === "Donor" && <Route path="/donor" element={<DonorDashboard />} />}
        {userRole === "NGO" && <Route path="/ngomap" element={<NgoMap />} />}
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/recipes" element={<Recipes />} />
        {/* Default redirect after login */}
        <Route
          path="*"
          element={<Navigate to={userRole === "Donor" ? "/donor" : "/ngomap"} />}
        />
      </Routes>
    </Router>
  );
}
