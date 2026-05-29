const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");

// Get inventory (exclude picked up)
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find({ status: { $ne: "Picked Up" } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new item
router.post("/", async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reserve item
router.put("/:id/reserve", async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(
      req.params.id,
      { status: "Reserved" },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pickup item
router.put("/:id/pickup", async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(
      req.params.id,
      { status: "Picked Up" },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Distinct filters for dropdowns
router.get("/filters", async (req, res) => {
  try {
    const states = await Inventory.distinct("state");
    const districts = await Inventory.distinct("district");
    const places = await Inventory.distinct("place");
    const items = await Inventory.distinct("name");
    res.json({ states, districts, places, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
