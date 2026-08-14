/**
 * AuthContext
 * ─────────────────────────────────────────────────────────────────
 * Provides authentication state and login/logout methods.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import authService from '@services/auth/authService';
import storageService from '@services/storage/storageService';

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(token && user);

  /**
   * login — Authenticate Officer credentials against Laravel API
   */
  const login = useCallback(async (credentials) => {
    try {
      const data = await authService.login(credentials);

      if (data && data.success && data.token) {
        await storageService.setToken(data.token);
        await storageService.setUser(data.user);
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        throw new Error(data?.message || 'Login failed');
      }
    } catch (error) {
      let errorMessage = 'Unable to connect to server';

      if (error.response) {
        const status = error.response.status;
        const apiMessage = error.response.data?.message;

        if (status === 401) {
          errorMessage = apiMessage || 'Invalid Email or Password';
        } else if (status === 403) {
          errorMessage = apiMessage || 'Your account is inactive';
        } else if (status === 422) {
          errorMessage = apiMessage || 'Please check your credentials';
        } else if (apiMessage) {
          errorMessage = apiMessage;
        }
      } else if (error.message && error.message !== 'Network Error' && !error.message.includes('timeout')) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }, []);

  /**
   * logout — Clear session and storage
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (_err) {
      // Ignore network error on logout and proceed to clear local storage
    }
    await storageService.clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  /**
   * updateUser — Update local user data
   */
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const updated = prev ? { ...prev, ...updatedData } : null;
      if (updated) {
        storageService.setUser(updated);
      }
      return updated;
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    setIsLoading,
    setUser,
    setToken,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
};

export default AuthContext;
