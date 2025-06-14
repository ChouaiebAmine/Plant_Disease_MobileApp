import React, { createContext, useState, useEffect, useContext } from "react";
import storageService from "../services/storageService"; 
import apiService from "../services/apiService"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null); 

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await storageService.getToken();
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error("Restoring token failed", e);
      } finally {
        setIsLoading(false);
      }
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
          setUserData({ email: email });
        } else {
          throw new Error("Login failed: No token received");
        }
      } catch (error) {
        console.error("Sign in error:", error);
        throw error; 
      }
    },
    signUp: async (email, password) => {
      try {
        const data = await apiService.register(email, password);
        if (data.token) {
          await storageService.saveToken(data.token);
          setUserToken(data.token);
       
          setUserData({ email: email }); 
        } else {
          throw new Error("Sign up failed: No token received");
        }
      } catch (error) {
        console.error("Sign up error:", error);
        throw error; 
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
    user: userData, 
    userToken,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


