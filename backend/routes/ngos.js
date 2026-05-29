const express = require("express");
const router = express.Router();
const Ngo = require("../models/Ngo");

// Get all NGOs
router.get("/", async (req, res) => {
  try {
    const ngos = await Ngo.find();
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add NGO
router.post("/", async (req, res) => {
  try {
    const ngo = new Ngo(req.body);
    await ngo.save();
    res.json(ngo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
