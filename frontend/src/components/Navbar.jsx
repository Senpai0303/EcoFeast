// src/components/Navbar.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-accent text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">EcoFeast</h1>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 bg-accent-dark rounded hover:bg-accent-light transition"
        >
          Menu ▾
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg"
            >
              <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
              <Link to="/inventory" className="block px-4 py-2 hover:bg-gray-100">Inventory</Link>
              <Link to="/recipes" className="block px-4 py-2 hover:bg-gray-100">Recipes</Link>
              <Link to="/analytics" className="block px-4 py-2 hover:bg-gray-100">Analytics</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
