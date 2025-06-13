//receiving base64 json (removed multer)

const express = require("express");
const router = express.Router();

const path = require("path");
const fs = require("fs");
const diseaseDetection = require("../models/diseaseDetection"); 



// Get plant by ID
router.get("/plants/:id", (req, res) => {
  const plant = plants.find((p) => p.id === req.params.id);
  if (!plant) {
    return res.status(404).json({ message: "Plant not found" });
  }
  res.json(plant);
});
//Found the Problem
//expects JSON with base64 image
router.post("/detect", async (req, res) => {
  //Debugging :receiving
  console.log("/api/detect Request Received (JSON) ");
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("req.body keys:", Object.keys(req.body));

  try {
    // base64 string from request body
    const base64Image = req.body.image;

    if (!base64Image) {
      console.error("Error: req.body.image is missing.");
      return res.status(400).json({ message: "No image data provided in JSON body" });
    }

    console.log("Received base64 image snippet.");

    //pass base64 string directly to detection function
    const result = await diseaseDetection.detectDisease(base64Image);

    res.json(result);
  } catch (error) {
    console.error("Error in /api/detect route:", error);
    res.status(500).json({ message: "Error processing image", error: error.message });
  }
});

module.exports = router;
