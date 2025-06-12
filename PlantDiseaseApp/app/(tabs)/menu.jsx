import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors"; 
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext"; 

export default function MenuScreen() {
  const [darkMode, setDarkMode] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const router = useRouter();
  const { user, signOut } = useAuth(); 

  const toggleDarkMode = () => setDarkMode(previousState => !previousState);
  const toggleNotifications = () =>
    setNotifications(previousState => !previousState);

  const handleLogout = async () => {
    try {
      await signOut();
      Alert.alert("Logged Out", "You have been successfully logged out.");
      router.replace("/(tabs)/menu"); 
    } catch (error) {
      Alert.alert("Logout Failed", "An error occurred while logging out.");
      console.error("Logout error:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {user ? (
          <>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color={colors.textPrimary}
                />
                <Text style={styles.menuItemText}>{user.email || "User Profile"}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="log-out-outline"
                  size={24}
                  color={colors.error} 
                />
                <Text style={[styles.menuItemText, { color: colors.error }]}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => router.push("/LoginScreen")}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="log-in-outline"
                  size={24}
                  color={colors.textPrimary}
                />
                <Text style={styles.menuItemText}>Login</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => router.push("/SignupScreen")}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="person-add-outline"
                  size={24}
                  color={colors.textPrimary}
                />
                <Text style={styles.menuItemText}>Sign Up</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </>
        )}
        
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Navigate", "To Help Center")}>
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={colors.textPrimary}
            />
            <Text style={styles.menuItemText}>Help Center</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Navigate", "To Contact Us")}>
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={colors.textPrimary}
            />
            <Text style={styles.menuItemText}>Contact Us</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Navigate", "To Terms & Privacy")}>
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={colors.textPrimary}
            />
            <Text style={styles.menuItemText}>Terms & Privacy</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.textPrimary}
            />
            <Text style={styles.menuItemText}>App Version</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </TouchableOpacity>
      </View>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, 
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary, 
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textSecondary, 
    marginHorizontal: 16,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.cardBackground, 
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border, 
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  versionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  
});

