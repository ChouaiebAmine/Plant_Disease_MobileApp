//receiving base64 json (removed multer)

const express = require("express");
const router = express.Router();

const path = require("path");
const fs = require("fs");
const diseaseDetection = require("../models/diseaseDetection"); 


//mmock plant data
const plants = [
  {
    id: "1",
    name: "Golden Pothoos",
    scientificName: "Epipremnum aureum",
    image:
      "https://www.thespruce.com/thmb/T38m3kxdsCWmKDJKfBFW55Nzc5w=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/pothos-plant-2132854-hero-03-0a8f0bb1b0944469b5e7b7be3196a763.jpg",
    description:
      "Golden pothos is one of the most popular houseplants in the world because it is so easy to care for. It has heart-shaped leaves that are variegated in green and yellow.",
    careInstructions: {
      light: "Medium to low indirect light",
      water: "Allow soil to dry out between waterings",
      temperature: "65-85°F (18-29°C)",
      humidity: "Average household humidity",
      soil: "Well-draining potting mix",
    },
  },
  {
    id: "2",
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    image:
      "https://www.thespruce.com/thmb/StjXQe0jmOrBrQ8vOaVTXvvHFN0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/snake-plant-care-guide-4796668-hero-80bc5d2ecc7c4c1abcfa753c5f31ca95.jpg",
    description:
      "The snake plant is a popular indoor plant with stiff, upright leaves that range from 6 inches to 8 feet tall, depending on the variety.",
    careInstructions: {
      light: "Low to bright indirect light",
      water: "Allow soil to dry completely between waterings",
      temperature: "70-90°F (21-32°C)",
      humidity: "Low to average household humidity",
      soil: "Well-draining cactus or succulent mix",
    },
  },
  {
    id: "3",
    name: "Aloe Vera",
    scientificName: "Aloe vera",
    image:
      "https://www.thespruce.com/thmb/1g_y9xyi8hLEL4H6tZQXa_xAB_g=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/grow-aloe-vera-1902817-hero-0a8f0bb1b0944469b5e7b7be3196a763.jpg",
    description:
      "Aloe vera is a succulent plant species that is found only in cultivation, having no naturally occurring populations.",
    careInstructions: {
      light: "Bright indirect light",
      water: "Water deeply but infrequently",
      temperature: "55-80°F (13-27°C)",
      humidity: "Low humidity",
      soil: "Cactus or succulent mix",
    },
  },
];

// API Routes

// Get all plants
router.get("/plants", (req, res) => {
  res.json(plants);
});

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
