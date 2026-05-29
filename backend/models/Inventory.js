const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date },
  status: { type: String, default: "Available" },
  location: { lat: Number, lng: Number },
  state: String,
  district: String,
  place: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inventory", InventorySchema);
