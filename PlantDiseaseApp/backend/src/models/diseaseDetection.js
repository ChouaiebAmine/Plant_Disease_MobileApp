const axios = require("axios");


// Flask API URL 
const FLASK_API_URL = "http://127.0.0.1:5001"; //Flask runs on the same machine as Express

/**
 * Detect plant disease from a base64 image string by calling the Python API
 * @param {string} base64Image -Base64 encoded image string 
 * @returns {Object} -Detection result from Flask API
 */
const detectDisease = async (base64Image) => {
  try {
    // Base64 string is received directly as argument
    console.log("Sending base64 snippet to Flask API:", `${FLASK_API_URL}/predict`);

    // Call the Python API
    const response = await axios.post(
      `${FLASK_API_URL}/predict`,
      {
        image: base64Image, // Send the base64 string directly
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;
    console.log("Flask API Response:", result);

    // Return the result directly from Flask API
    return result;
  } catch (error) {
    console.error("Error calling Flask API in diseaseDetection:", error.response ? error.response.data : error.message);

    // Improved error forwarding
    if (error.response) {
      // Forward the error from the Flask API
      throw new Error(
        `Flask API Error: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`
      );
    } else {
      // General error (e.g., network issue connecting to Flask)
      throw new Error(`Error connecting to Flask API: ${error.message}`);
    }
  }
};

/**
 * Checks the health of the Flask Model API.
 * @returns {Promise<boolean>} - Whether the API is running
 */
const checkModelApiHealth = async () => {
  try {
    const response = await axios.get(`${FLASK_API_URL}/health`);
    return response.data.status === "healthy";
  } catch (error) {
    console.error("Model API health check failed:", error.message);
    return false;
  }
};

module.exports = {
  detectDisease,
  checkModelApiHealth,
};
