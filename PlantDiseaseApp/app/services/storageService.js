//local storage
// import AsyncStorage from "@react-native-async-storage/async-storage"; 

import apiService from "./apiService"; 

// Get the diagnosis history from the backend API
const getDiagnosisHistory = async () => {
  try {
  
    const history = await apiService.getDiagnosisHistory();
    return history; 
  } catch (error) {
    console.error("Error fetching diagnosis history via API:", error);
    return []; 
  }
};

// Add a new diagnosis result by sending it to the backend API
const addDiagnosisResult = async (newResult) => {
  try {
    const diagnosisData = {
      imageUri: newResult.imageUri,
      isHealthy: newResult.isHealthy,
      plant: newResult.plant,
      disease: newResult.disease,
      confidence: newResult.confidence,
      treatment: newResult.treatment,
    };

    // Call the API service function to save the diagnosis
    const savedDiagnosis = await apiService.saveDiagnosis(diagnosisData);
    console.log("Diagnosis result saved successfully via API:", savedDiagnosis);
    return savedDiagnosis; 

  } catch (error) {
    console.error("Error saving diagnosis result via API:", error);
    
    throw error;
  }
};

// clear the diagnosis history (This would now require a backend endpoint)
const clearDiagnosisHistory = async () => {
  try {
    // TO DO: Implement a backend endpoint to clear history 
    console.warn("Clearing diagnosis history is not implemented on the backend yet.");
   //Debug
    console.log("Diagnosis history clear function called (no backend action).");
  } catch (e) {
    console.error("Error clearing diagnosis history (frontend placeholder)", e);
  }
};

export default {
  getDiagnosisHistory,
  addDiagnosisResult,
  clearDiagnosisHistory,
};

