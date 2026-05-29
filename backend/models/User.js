const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, required: true, enum: ["Donor", "NGO"] }
});

module.exports = mongoose.model("User", UserSchema);
