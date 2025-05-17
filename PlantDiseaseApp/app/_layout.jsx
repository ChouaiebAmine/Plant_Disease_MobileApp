import { SplashScreen, Stack } from "expo-router";
import colors from "./theme/colors.js"; 
import { AuthProvider, useAuth } from "./contexts/AuthContext"; 
import { useEffect } from "react";


SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background, 
        },
        headerTintColor: colors.textPrimary, 
      }}
    >
      
      <Stack.Screen 
        name="(tabs)" 
        options={{ title: "PlantDiseaseApp", headerShown: true }} 
      />
       <Stack.Screen 
        name="LoginScreen" 
        options={{ title: "Login", presentation: "modal" }} 
      />
      <Stack.Screen 
        name="SignupScreen" 
        options={{ title: "Sign Up", presentation: "modal" }} 
      />
      
      <Stack.Screen 
        name="screens/diagnosis-result" 
        options={{ title: "Diagnosis Result"}} 
      /> 
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

