import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DonorDashboard() {
  const [inventory, setInventory] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false); // Loading state

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/inventory');
      setInventory(res.data);
    } catch (error) { console.error("Error fetching data", error); }
  };

  const addItem = async (e) => {
    e.preventDefault();
    
    // Get user's real location before saving
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          await axios.post('http://localhost:5000/api/inventory', {
            name: newItemName,
            quantity: 1,
            expiryDate: new Date(Date.now() + 86400000 * 3),
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
          setNewItemName('');
          fetchInventory();
          alert("Item added to the marketplace!");
        } catch (error) { console.error("Error adding item", error); }
      }, (error) => {
        alert("Please enable location services to donate items.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const generateRecipe = async () => {
    setIsGenerating(true);
    try {
      const ingredients = inventory.map(item => item.name);
      
      // Safety check!
      if (ingredients.length === 0) {
          alert("Please add at least one item to your pantry first!");
          setIsGenerating(false);
          return;
      }

      const res = await axios.post('http://localhost:5000/api/recipes/generate', { ingredients });
      
      console.log("Success! Received from AI:", res.data); // This logs the data so we can see it
      setRecipe(res.data);
      
    } catch (error) {
      // This will give us the exact error message from the backend
      const errorMessage = error.response ? error.response.data.error : error.message;
      console.error("Error generating recipe:", errorMessage);
      alert(`AI Error: ${errorMessage}`); 
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-green-600">Donor Dashboard</h1>
        <p className="text-gray-600">Manage your pantry and reduce waste</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Log New Item</h2>
          <form onSubmit={addItem} className="mb-4 flex gap-2">
            <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="E.g., Apples" className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400" required />
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-bold shadow-sm">Donate</button>
          </form>
          
          <h3 className="font-semibold text-gray-700 mt-6 mb-2">Active Inventory</h3>
          <ul className="space-y-2">
            {inventory.map((item) => (
              <li key={item._id} className={`flex justify-between items-center p-3 rounded border ${item.status === 'Reserved' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
                <span className="font-medium flex items-center gap-2">
                    {item.name} 
                    {item.status === 'Reserved' && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Reserved by NGO</span>}
                </span>
                <span className="text-sm text-red-500 font-semibold">Exp: {new Date(item.expiryDate).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">AI Chef</h2>
          <button 
            onClick={generateRecipe} 
            disabled={isGenerating || inventory.length === 0}
            className={`w-full text-white px-4 py-3 rounded-lg transition mb-4 font-semibold shadow ${isGenerating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isGenerating ? 'Cooking up a recipe...' : 'Generate Recipe from Inventory'}
          </button>
          
          {recipe && (
            <div className="bg-blue-50 p-5 rounded border border-blue-200 mt-4 animate-fade-in">
              <h3 className="font-bold text-xl text-blue-800 mb-2">{recipe.recipeName}</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{recipe.instructions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;