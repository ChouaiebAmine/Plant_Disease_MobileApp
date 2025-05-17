const mongoose = require("mongoose");

const DiagnosisSchema = new mongoose.Schema({
  imageUri: {
    type: String, 
    required: true,
  },
  isHealthy: {
    type: Boolean,
    required: true,
  },
  plant: {
    type: String,
    required: true,
  },
  disease: {
    type: String,
    required: function() { return !this.isHealthy; }, 
  },
  confidence: {
    type: Number,
    required: function() { return !this.isHealthy; }, 
  },
  treatment: {
    type: [String], 
    default: [],
  },
  diagnosedAt: {
    type: Date,
    default: Date.now,
  },
   userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
     required: true, //diagnoses are tied to users
  }
});

module.exports = mongoose.model("Diagnosis", DiagnosisSchema);

