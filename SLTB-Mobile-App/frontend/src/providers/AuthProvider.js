/**
 * AuthProvider
 * ─────────────────────────────────────────────────────────────────
 * Provider wrapper for the AuthContext.
 * Hydrates stored token and officer session on mount.
 */

import React, { useEffect } from 'react';
import { AuthContextProvider, useAuthContext } from '@contexts';
import storageService from '@services/storage/storageService';

const AuthInitializer = ({ children }) => {
  const { setToken, setUser, setIsLoading } = useAuthContext();

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const storedToken = await storageService.getToken();
        const storedUser = await storageService.getUser();
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (_error) {
        // Storage error — stay unauthenticated
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, [setToken, setUser, setIsLoading]);

  return children;
};

const AuthProvider = ({ children }) => {
  return (
    <AuthContextProvider>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </AuthContextProvider>
  );
};

export default AuthProvider;
