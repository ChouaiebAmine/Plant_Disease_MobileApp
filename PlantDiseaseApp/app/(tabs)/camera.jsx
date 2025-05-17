import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native"
import { router } from "expo-router"
import { CameraView, useCameraPermissions } from "expo-camera"
import colors from "../theme/colors"

export default function CameraScreen() {
  const [facing, setFacing] = useState("back")
  const [permission, requestPermission] = useCameraPermissions()
  const [camera, setCamera] = useState(null)

  const takePicture = async () => {
    if (camera) {
      try {
        const photo = await camera.takePictureAsync({
          quality: 0.8
        })

        router.push({
          pathname: "/screens/diagnosis-result",
          params: { imageUri: photo.uri }
        })
      } catch (error) {
        console.error("Error taking picture:", error)
      }
    }
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === "back" ? "front" : "back"))
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
        <TouchableOpacity
          style={[styles.button, { marginTop: 12 }]}
          onPress={() => router.push("/screens/diagnosis")}
        >
          <Text style={styles.buttonText}>Go to Diagnosis</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={ref => setCamera(ref)}
        onCameraReady={() => console.log("Camera is ready")}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.flipText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          />
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: colors.textPrimary,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16
  },
  camera: {
    flex: 1,
    width: "100%"
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    margin: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "white",
    backgroundColor: "rgba(255, 255, 255, 0.3)"
  },
  flipButton: {
    position: "absolute",
    left: 20,
    bottom: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 10
  },
  flipText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "bold"
  }
})
