const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// ==========================================
// 1. SCHEMAS & MODELS
// ==========================================

// User Schema (Handles Roles)
const UserSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    role: { type: String, required: true, enum: ['Donor', 'NGO'] }
});
const User = mongoose.model('User', UserSchema);

// Inventory Schema (Handles Food & Map Coordinates)
const InventorySchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    expiryDate: Date,
    status: { type: String, default: 'Available' }, // Available, Reserved, Picked Up
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }
});
const Inventory = mongoose.model('Inventory', InventorySchema);

// ==========================================
// 2. USER AUTHENTICATION ROUTES
// ==========================================

// Register a new user role (THIS WAS LIKELY MISSING!)
app.post('/api/users/register', async (req, res) => {
    try {
        let user = await User.findOne({ firebaseUid: req.body.firebaseUid });
        if (user) return res.status(400).json({ msg: 'User exists' });
        
        user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Fetch user role on Login (THIS WAS LIKELY MISSING TOO!)
app.get('/api/users/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.uid });
        if (!user) return res.status(404).json({ msg: 'User profile not found in MongoDB' });
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 3. INVENTORY & DONATION ROUTES
// ==========================================

app.get('/api/inventory', async (req, res) => {
    try {
        // Hide items that are already picked up
        const items = await Inventory.find({ status: { $ne: 'Picked Up' } });
        res.json(items);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/inventory', async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        await newItem.save();
        res.json(newItem);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/inventory/:id/reserve', async (req, res) => {
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, { status: 'Reserved' }, { new: true });
        res.json(updatedItem);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/inventory/:id/pickup', async (req, res) => {
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, { status: 'Picked Up' }, { new: true });
        res.json(updatedItem);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 4. AI RECIPE ENGINE ROUTE
// ==========================================

app.post('/api/recipes/generate', async (req, res) => {
    const { ingredients } = req.body;
    if (!ingredients || ingredients.length === 0) return res.status(400).json({ error: "No ingredients provided" });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a creative chef. Generate a short, delicious recipe using these expiring ingredients. Format with a Title on line 1, then ingredients, then short steps." },
                { role: "user", content: ingredients.join(', ') }
            ]
        });

        const responseText = completion.choices[0].message.content;
        const lines = responseText.split('\n');
        
        res.json({
            recipeName: lines[0].replace(/#/g, '').trim() || "AI Generated Eco-Feast",
            instructions: lines.slice(1).join('\n').trim()
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch AI recipe." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`EcoFeast Backend running on port ${PORT}`));