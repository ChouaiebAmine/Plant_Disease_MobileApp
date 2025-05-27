
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors"; 

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
        },
        
        headerShown: false, 
      }}
  >
      <Tabs.Screen
        name="index" 
        options={{
          title: "My Plants",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search" // (tabs)/search.jsx
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
    />
      <Tabs.Screen
        name="camera" // (tabs)/camera.jsx
        options={{
          title: "Camera",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="menu" // (tabs)/menu.jsx
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="LoginScreen" 
        options={{
          title: "Login",
          href: null
        }}
      />
      <Tabs.Screen
        name="SignupScreen" 
        options={{
          title: "Login",
          href: null
        }}
      />
    </Tabs>
  );
}

