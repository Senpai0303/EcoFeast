const express = require("express");
const axios = require("axios");

const router = express.Router();

// Fallback recipes (always available)
const fallbackRecipes = {
  tomato: {
  recipeName: "Tomato Soup",
  instructions: `
Ingredients:
- 4 ripe tomatoes
- 1 onion
- 2 cloves garlic
- 1 tsp butter
- 1 tsp salt
- 1 tsp black pepper
- 1 tsp sugar
- 2 cups vegetable stock

Steps:
1. Wash and chop tomatoes, onion, and garlic.
2. Heat butter in a pan, sauté onion and garlic until golden.
3. Add chopped tomatoes, cook until soft.
4. Pour in vegetable stock, simmer for 10 minutes.
5. Blend mixture until smooth.
6. Add salt, pepper, and sugar. Simmer for 5 minutes.
7. Serve hot with bread or croutons.
`
},

  potato: {
  recipeName: "Potato Fry",
  instructions: `
Ingredients:
- 3 medium potatoes
- 1 onion
- 1 tsp mustard seeds
- 1 tsp turmeric powder
- 1 tsp red chili powder
- 2 tbsp oil
- Salt to taste

Steps:
1. Peel and slice potatoes into thin wedges.
2. Heat oil in a pan, add mustard seeds until they splutter.
3. Add sliced onion, sauté until golden.
4. Add potatoes, turmeric, chili powder, and salt.
5. Stir well, cover, and cook on low flame for 10–12 minutes.
6. Stir occasionally until potatoes are crispy and cooked.
7. Serve hot with chapati or rice.
`
},
  moongdal: {
  recipeName: "Moong Dal Curry",
  instructions: `
Ingredients:
- 1 cup moong dal (split yellow lentils)
- 1 onion
- 2 tomatoes
- 2 green chilies
- 1 tsp ginger-garlic paste
- 1 tsp turmeric powder
- 1 tsp cumin seeds
- 1 tsp garam masala
- 2 tbsp oil
- Salt to taste

Steps:
1. Wash and soak moong dal for 30 minutes.
2. Pressure cook dal with turmeric and 2 cups water (2 whistles).
3. Heat oil in a pan, add cumin seeds.
4. Add onion, ginger-garlic paste, sauté until golden.
5. Add chopped tomatoes and green chilies, cook until soft.
6. Add cooked dal, salt, and garam masala. Mix well.
7. Simmer for 5 minutes, garnish with coriander leaves.
8. Serve hot with rice or chapati.
`
},
  onion: {
  recipeName: "Onion Pakora",
  instructions: `
Ingredients:
- 2 large onions
- 1 cup gram flour (besan)
- 1 tsp turmeric powder
- 1 tsp red chili powder
- 1 tsp carom seeds (ajwain)
- Salt to taste
- Oil for deep frying

Steps:
1. Slice onions thinly and place in a bowl.
2. Add gram flour, turmeric, chili powder, ajwain, and salt.
3. Mix well, adding a little water to form a thick batter.
4. Heat oil in a deep pan.
5. Drop spoonfuls of batter into hot oil.
6. Fry until golden brown and crispy.
7. Drain on paper towels, serve hot with chutney or tea.
`
}
};


router.post("/generate", async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: "No ingredients provided" });
    }

    const prompt = `Generate a recipe using these ingredients: ${ingredients.join(", ")}.
    Provide a recipe name and step-by-step instructions.`;

    const model = "tiiuae/falcon-7b-instruct";

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    const text = response.data[0]?.generated_text;
    if (!text) throw new Error("Empty AI response");

    const [firstLine, ...rest] = text.split("\n");
    const recipeName =
      firstLine.replace(/^Recipe Name[:\-]?\s*/i, "") || "AI Generated Recipe";
    const instructions = rest.join("\n").trim();

    res.json({ recipeName, instructions, source: "AI" });
  } catch (err) {
    console.error("HF error:", err.message);

    // ✅ Fallback based on ingredient
    const { ingredients } = req.body;
    const key = ingredients[0].toLowerCase().replace(/\s+/g, "");
    const fallbackRecipe = fallbackRecipes[key] || {
      recipeName: "Simple Mixed Veg Curry",
      instructions: "1. Chop vegetables...\n2. Cook with spices...\n3. Serve hot."
    };

    res.json({ ...fallbackRecipe, source: "Fallback" });
  }
});


module.exports = router;
