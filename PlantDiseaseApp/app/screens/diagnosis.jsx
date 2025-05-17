import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native"
import { router } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import colors from "../theme/colors"

export default function DiagnosisScreen() {
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!")
      return
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })

      if (!result.canceled) {
        router.push({
          pathname: "/screens/diagnosis-result",
          params: { imageUri: result.assets[0].uri }
        })
      }
    } catch (error) {
      alert("Error taking photo")
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!")
      return
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })

      if (!result.canceled) {
        router.push({
          pathname: "/screens/diagnosis-result",
          params: { imageUri: result.assets[0].uri }
        })
      }
    } catch (error) {
      alert("Error selecting image")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Health</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.diagnosisCard}>
          <View style={styles.cardContent}>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Plant health</Text>
              <Text style={styles.cardDescription}>
                Check your plant's health.
              </Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={openCamera}
              >
                <Text style={styles.actionButtonText}>Diagnose</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.diagnosisCard}>
          <View style={styles.cardContent}>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Botanist Help</Text>
              <Text style={styles.cardDescription}>
                Send your request and get professional Care Guide.
              </Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  // In a real app, navigate to botanist help form
                  console.log("Navigate to botanist help")
                }}
              >
                <Text style={styles.actionButtonText}>Ask the Botanist</Text>
              </TouchableOpacity>
            </View>
            <Image style={styles.cardImage} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>Your History</Text>
          <View style={styles.historyItem}>
            <Text style={styles.historyItemText}>Identification history</Text>
            <Text style={styles.historyItemSubtext}>Take your first scan!</Text>
            <TouchableOpacity style={styles.scanButton} onPress={pickImage}>
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: "relative"
  },
  backButton: {
    position: "absolute",
    left: 16
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary
  },
  content: {
    padding: 16
  },
  diagnosisCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden"
  },
  cardContent: {
    flexDirection: "row",
    padding: 16
  },
  cardTextContent: {
    flex: 1,
    marginRight: 16
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start"
  },
  actionButtonText: {
    color: colors.textPrimary,
    fontWeight: "bold"
  },
  cardImage: {
    width: 100,
    height: 100
  },
  historyCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16
  },
  historyItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    position: "relative"
  },
  historyItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4
  },
  historyItemSubtext: {
    fontSize: 14,
    color: colors.textSecondary
  },
  scanButton: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -16,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  scanButtonText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "bold"
  }
})
