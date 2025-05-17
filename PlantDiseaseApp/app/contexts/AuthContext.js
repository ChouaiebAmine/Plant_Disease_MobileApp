import React, { createContext, useState, useEffect, useContext } from "react";
import storageService from "../services/storageService"; 
import apiService from "../services/apiService"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null); // Optional: to store basic user info

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await storageService.getToken();
      } catch (e) {
        // Restoring token failed
        console.error("Restoring token failed", e);
      }
      setUserToken(token);
      // If you store user data, you might fetch it here if token exists
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (email, password) => {
      try {
        const data = await apiService.login(email, password);
        if (data.token) {
          await storageService.saveToken(data.token);
          setUserToken(data.token);
          // Optionally fetch and set user data here
        } else {
          throw new Error("Login failed: No token received");
        }
      } catch (error) {
        console.error("Sign in error:", error);
        throw error; // Re-throw to be caught by UI
      }
    },
    signUp: async (email, password) => {
      try {
        const data = await apiService.register(email, password);
        if (data.token) {
          await storageService.saveToken(data.token);
          setUserToken(data.token);
          // Optionally fetch and set user data here
        } else {
          throw new Error("Sign up failed: No token received");
        }
      } catch (error) {
        console.error("Sign up error:", error);
        throw error; // Re-throw to be caught by UI
      }
    },
    signOut: async () => {
      try {
        await storageService.removeToken();
        setUserToken(null);
        setUserData(null);
      } catch (error) {
        console.error("Sign out error:", error);
      }
    },
    userToken,
    userData,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

