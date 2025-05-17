require('dotenv').config({ path: '../.env' });
const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const morgan = require("morgan");

const mongoose = require("mongoose");

// Log environment variables for debugging
console.log("Environment variables loaded:");
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

// import routes
const apiRoutes = require("./routes/api");
const diagnosisRoutes = require("./routes/diagnosisRoutes");
const authRoutes = require("./routes/authRoutes"); 

// init express app
const app = express();
const PORT = process.env.PORT || 5000;

//MongoDB Connection 
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env file");
  process.exit(1); 
}

mongoose.connect(MONGODB_URI, {
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1); 
});


// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); //limit for base64 images
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api", apiRoutes);
// Mount diagnosis routes
app.use("/api/diagnoses", diagnosisRoutes); 
//auth route
app.use("/api/auth", authRoutes); // auths routes (register, login)

//health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

//start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
