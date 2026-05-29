const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register new user
router.post("/register", async (req, res) => {
  try {
    let user = await User.findOne({ firebaseUid: req.body.firebaseUid });
    if (user) return res.status(400).json({ msg: "User exists" });

    user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by Firebase UID
router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.uid });
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
