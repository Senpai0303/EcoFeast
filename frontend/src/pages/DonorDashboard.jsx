import React, { useEffect, useState } from "react";
import InventoryCard from "../components/InventoryCard";
import Analytics from "../components/Analytics";

// Simple notification fallback
const notifySuccess = (msg) => alert(msg);
const notifyError = (msg) => alert(msg);

export default function DonorDashboard() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("inventory");

  // Recipe generator state
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch inventory
  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => notifyError("Failed to load inventory"));
  }, []);

  const reserveItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${id}/reserve`, { method: "PUT" });
      const updated = await res.json();
      setItems(items.map(i => i._id === id ? updated : i));
      notifySuccess("Item reserved successfully!");
    } catch {
      notifyError("Failed to reserve item");
    }
  };

  const pickupItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${id}/pickup`, { method: "PUT" });
      const updated = await res.json();
      setItems(items.map(i => i._id === id ? updated : i));
      notifySuccess("Item picked up successfully!");
    } catch {
      notifyError("Failed to pick up item");
    }
  };

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      notifyError("Please enter some ingredients!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredients.split(",") }),
      });
      const data = await res.json();
      setRecipe(data);
      notifySuccess("Recipe generated successfully!");
    } catch {
      notifyError("Failed to generate recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold">Donor Menu</h2>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`block w-full text-left px-4 py-2 rounded ${activeTab === "inventory" ? "bg-green-900" : ""}`}
        >
          Inventory
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`block w-full text-left px-4 py-2 rounded ${activeTab === "analytics" ? "bg-green-900" : ""}`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab("recipes")}
          className={`block w-full text-left px-4 py-2 rounded ${activeTab === "recipes" ? "bg-green-900" : ""}`}
        >
          Recipe Generator
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "inventory" && (
          <>
            <h1 className="text-2xl font-bold text-accent mb-4">Inventory</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <InventoryCard
                  key={item._id}
                  item={item}
                  onReserve={reserveItem}
                  onPickup={pickupItem}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "analytics" && (
          <>
            <h1 className="text-2xl font-bold text-accent mb-4">Analytics</h1>
            <Analytics items={items} />
          </>
        )}

        {activeTab === "recipes" && (
          <>
            <h1 className="text-2xl font-bold text-purple-600 mb-4">AI Recipe Generator</h1>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Enter ingredients (comma separated)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="flex-grow border rounded px-4 py-2"
              />
              <button
                onClick={generateRecipe}
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded"
              >
                {loading ? "Generating..." : "Generate Recipe"}
              </button>
            </div>
            {recipe && (
              <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-bold text-purple-600">{recipe.recipeName}</h2>
                <pre className="whitespace-pre-wrap text-gray-700">{recipe.instructions}</pre>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
