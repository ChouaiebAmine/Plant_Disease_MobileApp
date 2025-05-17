import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { useAuth } from "../contexts/AuthContext"; 
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    // Clear previous error messages
    setErrorMessage("");
    
    // Validate inputs
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      // Use Alert for native platforms
      if (Platform.OS !== 'web') {
        Alert.alert("Error", "Please enter both email and password.");
      }
      return;
    }
    
    try {
      await signIn(email, password);
      
      // Success message
      if (Platform.OS !== 'web') {
        Alert.alert("Success", "Logged in successfully!");
      } else {
        setErrorMessage(""); // Clear any error messages
      }
      
      router.replace("/(tabs)/index"); 
    } catch (error) {
      console.error("Login failed:", error);
      const errorMsg = error.message || "An unexpected error occurred. Please try again.";
      setErrorMessage(errorMsg);
      
      // Use Alert for native platforms
      if (Platform.OS !== 'web') {
        Alert.alert("Login Failed", errorMsg);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      {/* Error message display */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A9A9A9" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A9A9A9" 
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.buttonGreen} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonTransparent} onPress={() => router.push("/SignupScreen")}>
        <Text style={styles.buttonTextTransparent}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#000000", 
  },
  title: {
    fontSize: 28, 
    fontWeight: "bold",
    marginBottom: 30, 
    textAlign: "center",
    color: "#FFFFFF", 
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    textAlign: "center",
    fontSize: 14,
  },
  input: {
    height: 50, 
    borderColor: "#555555", 
    borderWidth: 1,
    marginBottom: 15, 
    paddingHorizontal: 15,
    borderRadius: 8, 
    color: "#FFFFFF", 
    backgroundColor: "#1C1C1E", 
    fontSize: 16,
  },
  buttonGreen: {
    backgroundColor: "#28a745", 
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF", 
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTransparent: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10, 
  },
  buttonTextTransparent: {
    color: "#28a745", 
    fontSize: 16,
  },
});

export default LoginScreen;
