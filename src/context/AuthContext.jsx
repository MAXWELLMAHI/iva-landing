"use client";
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../firebase/firebaseUtils';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Error checking auth state:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Sign up function
  const signup = async (email, password) => {
    try {
      setError(null);
      const newUser = await registerUser(email, password);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      await logoutUser();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 