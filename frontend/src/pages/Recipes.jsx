import React, { useState } from "react";

export default function Recipes() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      alert("Please enter some ingredients!");
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
    } catch {
      alert("Failed to generate recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-purple-600">AI Recipe Generator</h1>

      {/* Input box */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="flex-grow border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={generateRecipe}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </div>

      {/* Recipe Card */}
      {recipe && (
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-purple-600">{recipe.recipeName}</h2>
          <pre className="whitespace-pre-wrap text-gray-700">{recipe.instructions}</pre>
        </div>
      )}
    </div>
  );
}
