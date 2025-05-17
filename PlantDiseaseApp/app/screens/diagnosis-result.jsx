import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import colors from "../theme/colors";
import apiService from "../services/apiService";
import storageService from "../services/storageService"; // Import storage service

/*
import { decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import { fetch as tfFetch } from '@tensorflow/tfjs-react-native';
import { loadTFLiteModel } from '@tensorflow/tfjs-tflite';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
*/
export default function DiagnosisResultScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [imageUri, setImageUri] = useState(params.imageUri);
  const [isSaved, setIsSaved] = useState(false);

  const takePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take pictures"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture");
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Media library permission is required to select images"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const processImage = async (uri) => {
    if (!uri) return; 
    let apiSucceeded = false; 
    try {
      setLoading(true);
      setError("");
      setResult(null); 
      setIsSaved(false);

      
      const detectionData = await apiService.detectDisease(uri);
      apiSucceeded = true; // debug call

      //response matches UI
      const formattedResult = {
        isHealthy: detectionData.isHealthy,
        plant: detectionData.plant,
        disease: detectionData.disease,
        confidence: detectionData.confidence,
        treatment: detectionData.treatment,
      };
      setResult(formattedResult);

      // try {
      //   await storageService.addDiagnosisResult({
      //     imageUri: uri, // Save the image URI used for diagnosis
      //     ...formattedResult, // Spread the rest of the result data
      //   });
      // } catch (storageError) {
      //   console.error("Error saving diagnosis to history:", storageError);
      //   // Optional: Notify user that saving failed, but don't set the main error state
      //   // Alert.alert("Warning", "Diagnosis successful, but failed to save to history.");
      // }$

    } catch (error) {
      console.error("Error processing image:", error);
      if (!apiSucceeded) {
         setError("Failed to process image. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- handle saving the diagnosis ---
  const handleSaveDiagnosis = async () => {
    if (!result || isSaved) return // Don't save if no result or already saved

    try {
      await storageService.addDiagnosisResult({
        imageUri: imageUri, 
        ...result, 
      });
      setIsSaved(true); 
      Alert.alert("Success", "Diagnosis saved to history.");
    } catch (storageError) {
      console.error("Error saving diagnosis to history:", storageError);
      Alert.alert("Error", "Failed to save diagnosis to history.");
    }
  };


  React.useEffect(() => {
    if (imageUri) {
      processImage(imageUri);
    }
  }, []); 

  // handle starting a new diagnosis
  const handleNewDiagnosis = () => {
    setResult(null);
    setImageUri(null);
    setError("");
    setIsSaved(false); 
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Diagnosis</Text>
      </View>

      
      {!imageUri && !result && !loading && !error && (
        <View style={styles.uploadContainer}>
          <Text style={styles.uploadTitle}>Upload a photo of your plant</Text>
          <Text style={styles.uploadDescription}>
            Take a clear photo of the affected area to get an accurate diagnosis
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={takePicture}>
              <Text style={styles.uploadButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analyzing your plant...</Text>
        </View>
      )}

       
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={handleNewDiagnosis} 
          >
            <Text style={styles.tryAgainButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {result && !error && !loading && (
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>
              {result.isHealthy ? "Good News!" : "Diagnosis Result"}
            </Text>
            <Text style={styles.plantName}>{result.plant}</Text>
          </View>

          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.resultImage}
              resizeMode="cover"
            />
          )}

          <View
            style={[
              styles.diagnosisContainer,
              result.isHealthy
                ? styles.healthyContainer
                : styles.diseaseContainer,
            ]}
          >
            <View style={styles.diagnosisHeader}>
              <Text style={styles.diagnosisText}>
                {result.isHealthy ? "Your plant is healthy" : result.disease}
              </Text>
            </View>

            {!result.isHealthy && (
              <Text style={styles.confidenceText}>
                Confidence: {Math.round(result.confidence * 100)}%
              </Text>
            )}
          </View>

          {!result.isHealthy &&
            result.treatment &&
            result.treatment.length > 0 && (
              <View style={styles.treatmentContainer}>
                <Text style={styles.treatmentTitle}>Recommended Treatment</Text>
                {result.treatment.map((item, index) => (
                  <View key={index} style={styles.treatmentItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.treatmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

          
          <View style={styles.actionButtonsContainer}>
            {!isSaved ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveDiagnosis}
              >
                <Text style={styles.actionButtonText}>Save Diagnosis</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.actionButton, styles.savedIndicator]}>
                 <Text style={styles.savedIndicatorText}>✓ Saved</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.newDiagnosisButton]}
              onPress={handleNewDiagnosis} 
            >
              <Text style={styles.actionButtonText}>New Diagnosis</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    
    padding: 8,
    zIndex: 1, 
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  uploadContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    alignItems: "center",
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    // Removed marginBottom: 12 as gap is used
  },
  uploadButtonText: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  loadingContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  errorText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  tryAgainButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  tryAgainButtonText: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  resultContainer: {
    margin: 16,
  },
  resultHeader: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  plantName: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  resultImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  diagnosisContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  healthyContainer: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  diseaseContainer: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  diagnosisHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  diagnosisText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  confidenceText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  treatmentContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  treatmentItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: 8,
  },
  treatmentText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  actionButtonsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 16, 
  },
  actionButton: { 
    flex: 1, 
    
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 4, 
  },
  saveButton: { 
    backgroundColor: colors.success, 
  },
  newDiagnosisButton: { 
    backgroundColor: colors.primary,
  },
  actionButtonText: { 
    color: colors.white, 
    fontWeight: "bold",
    fontSize: 16,
  },
  savedIndicator: { 
    backgroundColor: colors.background, 
    borderWidth: 1,
    borderColor: colors.success,
  },
  savedIndicatorText: {  
    color: colors.success,
    fontWeight: "bold",
    fontSize: 16,
  },
});
