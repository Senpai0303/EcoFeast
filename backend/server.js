const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const recipesRouter = require("./routes/recipes.js");

dotenv.config();
console.log("Loaded ENV:", process.env);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("MongoDB connection error:", err));

app.use("/api/users", require("./routes/users"));
app.use("/api/inventory", require("./routes/inventory"));
app.use("/api/ngos", require("./routes/ngos"));
app.use("/api/recipes", recipesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`EcoFeast Backend running on port ${PORT}`));
