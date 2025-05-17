import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import colors from "../theme/colors";
import apiService from "../services/apiService"; 
import { useAuth } from "../contexts/AuthContext";

export default function MyPlantsScreen() {
  const { userToken } = useAuth(); 
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async () => {
    if (!userToken) {
      setDiagnosisHistory([]); 
      setLoading(false);
      setError("Please log in to view your diagnosis history.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const history = await apiService.getUserDiagnoses(); // Fetch from backend
      console.log("Diagnosis history loaded:", history);
      setDiagnosisHistory(history || []);
    } catch (e) {
      console.error("Failed to load diagnosis history:", e);
      setError(e.message || "Failed to load diagnosis history.");
      setDiagnosisHistory([]); // Clear history on error
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  useFocusEffect(loadHistory);

  // useEffect to reload history if userToken changes (e.g., after login/logout)
  useEffect(() => {
    loadHistory();
  }, [userToken, loadHistory]);

  const handleClearHistory = async () => {
    if (!userToken) {
      Alert.alert("Login Required", "You must be logged in to clear history.");
      return;
    }
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all your diagnosis history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          onPress: async () => {
            try {
              setLoading(true);

              // for now, let's simulate or comment out until backend endpoint is ready
              // await apiService.clearUserDiagnoses(); 
              // For demonstration, we'll just clear it locally and log a message
              console.warn("Backend endpoint for clearing user-specific history not yet implemented. Clearing locally for now.");
              setDiagnosisHistory([]);
              Alert.alert("Success", "Diagnosis history cleared (locally for now).");
              // After implementing backend: Alert.alert("Success", "Diagnosis history cleared.");
            } catch (e) {
              console.error("Failed to clear history:", e);
              Alert.alert("Error", e.message || "Failed to clear diagnosis history.");
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  const navigateToNewDiagnosis = () => {
    // Navigate to the screen where user can start diagnosis
    // This could be the camera screen or an initial diagnosis options screen
    router.push("/screens/diagnosis-result"); // Assuming camera is the starting point for new diagnosis
  };
  
  const navigateToLogin = () => {
    router.push("/LoginScreen");
  }

  const renderHistoryItem = ({ item }) => {
    // Use the correct property names from the backend model
    const healthStatus = item.isHealthy ? "Healthy" : (item.disease || "Needs Attention");
    const diagnosisDate = formatDate(item.diagnosedAt || item.createdAt); // Use createdAt if diagnosedAt not present

    return (
      <TouchableOpacity 
        style={styles.plantCard} 
        onPress={() => router.push({ 
          pathname: "/diagnosis-result", 
          params: { 
            imageUri: item.imageUri, 
            fromHistory: true, 
            diagnosisId: item._id 
          }
        })}
      >
        <Image
          source={{ uri: item.imageUri }}
          style={styles.plantImage}
          resizeMode="cover"
        />
        <View style={styles.plantInfo}>
          <Text style={styles.plantName}>{item.plant || "Unknown Plant"}</Text>
          <Text style={styles.plantSpecies}>
            {item.isHealthy ? "Detected as Healthy" : (item.disease || "Disease Not Specified")}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.healthIndicator,
                item.isHealthy
                  ? styles.healthyIndicator
                  : styles.attentionIndicator,
              ]}
            />
            <Text style={styles.statusText}>{healthStatus}</Text>
          </View>
          <Text style={styles.waterStatus}>Diagnosed on: {diagnosisDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Diagnosis History...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diagnosis History</Text>
        <View style={styles.headerButtons}>
          {userToken && diagnosisHistory.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.addButton} onPress={navigateToNewDiagnosis}>
            <Text style={styles.addButtonText}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!userToken ? (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{error || "Please log in to view your diagnosis history."}</Text>
            <TouchableOpacity
              style={styles.addFirstButton} 
              onPress={navigateToLogin}
            >
              <Text style={styles.addFirstButtonText}>Login</Text>
            </TouchableOpacity>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>
           <TouchableOpacity
              style={styles.addFirstButton} 
              onPress={loadHistory} 
            >
              <Text style={styles.addFirstButtonText}>Try Again</Text>
            </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={diagnosisHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item._id || item.id} 
          contentContainerStyle={styles.plantList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No diagnosis history yet.</Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={navigateToNewDiagnosis}
              >
                <Text style={styles.addFirstButtonText}>Diagnose Your First Plant</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: colors.error,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  clearButtonText: {
    color: colors.white || "#FFFFFF",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white || "#FFFFFF",
    fontWeight: "bold",
  },
  plantList: {
    padding: 16,
  },
  plantCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  plantImage: {
    width: "100%",
    height: 180,
  },
  plantInfo: {
    padding: 16,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  plantSpecies: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    fontStyle: "italic",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  healthIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  healthyIndicator: {
    backgroundColor: colors.success,
  },
  attentionIndicator: {
    backgroundColor: colors.error,
  },
  statusText: {
    fontSize: 14,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  waterStatus: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  addFirstButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: colors.white || "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
