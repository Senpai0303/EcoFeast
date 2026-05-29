const mongoose = require("mongoose");

const NgoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: String,
  district: String,
  place: String,
  contact: String
});

module.exports = mongoose.model("Ngo", NgoSchema);
