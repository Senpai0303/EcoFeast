import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { auth } from './firebase'; // Assumes you created firebase.js
import { signOut } from 'firebase/auth';
import DonorDashboard from './pages/DonorDashboard';
import NgoMap from './pages/NgoMap';
import AuthPage from './pages/AuthPage';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (firebaseUser, role) => {
      setUser(firebaseUser);
      setUserRole(role);
  };

  const handleLogout = async () => {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
  };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  return (
    <Router>
      <nav className="bg-gray-800 p-4 text-white flex justify-between items-center shadow-md relative z-50">
          <div className="font-bold text-2xl text-green-400 tracking-wide">EcoFeast</div>
          <div className="flex gap-6">
              {userRole === 'Donor' && <Link to="/" className="hover:text-green-400 font-semibold transition">Donor Dashboard</Link>}
              {userRole === 'NGO' && <Link to="/map" className="hover:text-blue-400 font-semibold transition">NGO Map Portal</Link>}
          </div>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition">Log Out</button>
      </nav>

      <Routes>
        <Route path="/" element={userRole === 'Donor' ? <DonorDashboard /> : <Navigate to="/map" />} />
        <Route path="/map" element={userRole === 'NGO' ? <NgoMap /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;