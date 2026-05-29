const mongoose = require("mongoose");
const Inventory = require("./models/Inventory");
const Ngo = require("./models/Ngo");
require("dotenv").config();

// ✅ Use same .env variable as server.js
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for seeding"))
  .catch(err => console.error("MongoDB connection error:", err));

async function seed() {
  try {
    // Clear old data
    await Inventory.deleteMany({});
    await Ngo.deleteMany({});

    // Sample inventory items in Dehradun
    await Inventory.insertMany([
      {
        name: "Rice",
        quantity: 50,
        expiryDate: new Date("2026-06-01"),
        status: "Available",
        location: { lat: 30.3165, lng: 78.0322 },
        state: "Uttarakhand",
        district: "Dehradun",
        place: "Rajpur Road"
      },
      {
        name: "Wheat Flour",
        quantity: 30,
        expiryDate: new Date("2026-05-20"),
        status: "Available",
        location: { lat: 30.3256, lng: 78.0437 },
        state: "Uttarakhand",
        district: "Dehradun",
        place: "Clock Tower"
      },
  // Dal types
  { name: "Toor Dal", quantity: 40, state: "Uttarakhand", district: "Dehradun", place: "Rajpur Road", location: { lat: 30.3165, lng: 78.0322 } },
  { name: "Moong Dal", quantity: 25, state: "Uttarakhand", district: "Dehradun", place: "Clock Tower", location: { lat: 30.3256, lng: 78.0437 } },
  { name: "Masoor Dal", quantity: 30, state: "Uttarakhand", district: "Dehradun", place: "Prem Nagar", location: { lat: 30.3560, lng: 78.0480 } },
  { name: "Chana Dal", quantity: 20, state: "Uttarakhand", district: "Dehradun", place: "Patel Nagar", location: { lat: 30.3180, lng: 78.0290 } },

  // Vegetables
  { name: "Potatoes", quantity: 100, state: "Uttarakhand", district: "Dehradun", place: "Arhat Bazaar", location: { lat: 30.3200, lng: 78.0300 } },
  { name: "Tomatoes", quantity: 60, state: "Uttarakhand", district: "Dehradun", place: "Paltan Bazaar", location: { lat: 30.3190, lng: 78.0330 } },
  { name: "Onions", quantity: 80, state: "Uttarakhand", district: "Dehradun", place: "Saharanpur Road", location: { lat: 30.3100, lng: 78.0400 } },

  // Spices
  { name: "Turmeric Powder", quantity: 15, state: "Uttarakhand", district: "Dehradun", place: "Patel Nagar", location: { lat: 30.3180, lng: 78.0290 } },
  { name: "Red Chili Powder", quantity: 10, state: "Uttarakhand", district: "Dehradun", place: "Clock Tower", location: { lat: 30.3256, lng: 78.0437 } },
  { name: "Coriander Powder", quantity: 12, state: "Uttarakhand", district: "Dehradun", place: "Prem Nagar", location: { lat: 30.3560, lng: 78.0480 } },
  { name: "Cumin Powder", quantity: 12, state: "Uttarakhand", district: "Dehradun", place: "Prem Nagar", location: { lat: 30.3560, lng: 78.0480 } }
]);


    // Sample NGOs
    await Ngo.insertMany([
      {
        name: "Dehradun Food Relief NGO",
        state: "Uttarakhand",
        district: "Dehradun",
        place: "Rajpur Road",
        contact: "ngo1@example.com"
      },
      {
        name: "Haridwar Helping Hands",
        state: "Uttarakhand",
        district: "Haridwar",
        place: "Har Ki Pauri",
        contact: "ngo2@example.com"
      },
      {
        name: "Delhi Food Bank",
        state: "Delhi",
        district: "Central Delhi",
        place: "Connaught Place",
        contact: "ngo3@example.com"
      }
    ]);

    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
