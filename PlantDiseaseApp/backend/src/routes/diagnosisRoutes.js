const express = require("express");
const router = express.Router();
const Diagnosis = require("../models/Diagnosis");

// POST /api/diagnoses - Save a new diagnosis result
router.post("/", async (req, res) => {
  try {
    const {
      imageUri,
      isHealthy,
      plant,
      disease,
      confidence,
      treatment,
    } = req.body;

    // Basic validation (can be expanded)
    if (imageUri === undefined || isHealthy === undefined || plant === undefined) {
        return res.status(400).json({ message: "Missing required fields: imageUri, isHealthy, plant" });
    }
    if (!isHealthy && (disease === undefined || confidence === undefined)) {
        return res.status(400).json({ message: "Missing required fields for diseased plant: disease, confidence" });
    }

    const newDiagnosis = new Diagnosis({
      imageUri,
      isHealthy,
      plant,
      disease: isHealthy ? undefined : disease,
      confidence: isHealthy ? undefined : confidence,
      treatment: treatment || [], // Ensure treatment is an array
      // diagnosedAt is set by default in the schema
    });

    const savedDiagnosis = await newDiagnosis.save();
    res.status(201).json(savedDiagnosis);
  } catch (error) {
    console.error("Error saving diagnosis:", error);
    res.status(500).json({ message: "Failed to save diagnosis", error: error.message });
  }
});

// GET /api/diagnoses - Get all diagnosis history (consider adding user filtering later)
router.get("/", async (req, res) => {
  try {
    // Fetch diagnoses, sort by date descending
    const diagnoses = await Diagnosis.find().sort({ diagnosedAt: -1 });
    res.status(200).json(diagnoses);
  } catch (error) {
    console.error("Error fetching diagnosis history:", error);
    res.status(500).json({ message: "Failed to fetch diagnosis history", error: error.message });
  }
});

module.exports = router;

