import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api"; 

console.log("Using API Base URL:", API_BASE_URL);

const apiService = {
   
  register: async (email, password) => {
    try {
      const response = await apiClient.post("/auth/register", { email, password });
      return response.data; 
    } catch (error) {
      console.error("Error in apiService.register:", error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : new Error("Registration failed");
    }
  },

  login: async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      return response.data;  
    } catch (error) {
      console.error("Error in apiService.login:", error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : new Error("Login failed");
    }
  },

  // --- Disease Detection --- 
  detectDisease: async (imageUri) => {
    try {
      let base64Image = imageUri;

      // Check if the imageUri is already base64 encoded
      if (!imageUri.startsWith("data:image")) {

         console.warn("detectDisease expects a base64 encoded image string starting with 'data:image...'");

         if (imageUri.length > 100 && !imageUri.includes("/")) { 
            base64Image = imageUri; 
         } else {
            throw new Error("Invalid image format provided to detectDisease. Expected base64 string.");
         }
      } else {
         base64Image = imageUri.split(",")[1]; // extradct base64 part
      }

      console.log("Sending image for detection to:", `${API_BASE_URL}/detect`);

      const response = await axios.post(
        `${API_BASE_URL}/detect`,
        { image: base64Image },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Detection API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error in apiService.detectDisease:",
        error.response ? JSON.stringify(error.response.data, null, 2) : error.message
      );
      throw new Error(error.response?.data?.message || "Failed to detect disease via API");
    }
  },

  // --- Diagnosis History API Calls ---

  //save Diagnosis result to the backend
  saveDiagnosis: async (diagnosisData) => {
    try {
      console.log("Sending diagnosis data to save:", `${API_BASE_URL}/diagnoses`);
      const response = await axios.post(`${API_BASE_URL}/diagnoses`, diagnosisData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Save Diagnosis API Response:", response.data);
      return response.data; 
    } catch (error) {
      console.error(
        "Error in apiService.saveDiagnosis:",
        error.response ? JSON.stringify(error.response.data, null, 2) : error.message
      );
      throw new Error(error.response?.data?.message || "Failed to save diagnosis via API");
    }
  },

  // get the diagnosis history from the backend
  getDiagnosisHistory: async () => {
    try {
      console.log("Fetching diagnosis history from:", `${API_BASE_URL}/diagnoses`);
      const response = await axios.get(`${API_BASE_URL}/diagnoses`);
      console.log("Get History API Response:", response.data);
      return response.data; // Return the array of diagnosis history
    } catch (error) {
      console.error(
        "Error in apiService.getDiagnosisHistory:",
        error.response ? JSON.stringify(error.response.data, null, 2) : error.message
      );
      return []; 
    }
  },

  // --- End Diagnosis History API Calls ---

  // Get all plants 
  getPlants: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plants`);
      return response.data;
    } catch (error) {
      console.error("Error fetching plants:", error);
      throw error;
    }
  },

  // Get plant by ID 
  getPlantById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching plant with ID ${id}:`, error);
      throw error;
    }
  },
};

export default apiService;

