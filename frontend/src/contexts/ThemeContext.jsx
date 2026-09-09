import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfileSocket } from '../hooks/useProfileSocket';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [themePreference, setThemePreferenceState] = useState('light');
  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  // Sync with authenticated user's stored database preference when user changes
  useEffect(() => {
    if (user && user.theme_preference) {
      setThemePreferenceState(user.theme_preference);
    } else if (user && user.themePreference) {
      setThemePreferenceState(user.themePreference);
    }
    setIsThemeLoading(false);
  }, [user?.user_id, user?.userId, user?.theme_preference, user?.themePreference]);

  // Handle real-time WebSocket theme updates from other devices
  const handleThemeUpdatedFromSocket = useCallback((newTheme) => {
    if (newTheme && ['light', 'dark', 'system'].includes(String(newTheme).toLowerCase())) {
      setThemePreferenceState(String(newTheme).toLowerCase());
    }
  }, []);

  useProfileSocket(null, handleThemeUpdatedFromSocket);

  // System OS theme media query listener
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  // Compute resolved theme: 'light' or 'dark'
  const resolvedTheme = useMemo(() => {
    if (themePreference === 'system') {
      return systemTheme;
    }
    return themePreference === 'dark' ? 'dark' : 'light';
  }, [themePreference, systemTheme]);

  // Apply data-theme attribute on root <html> element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', resolvedTheme);
    }
  }, [resolvedTheme]);

  const setThemePreference = useCallback((newPref) => {
    const val = String(newPref).toLowerCase();
    if (['light', 'dark', 'system'].includes(val)) {
      setThemePreferenceState(val);
    }
  }, []);

  const refreshTheme = useCallback(() => {
    if (user && (user.theme_preference || user.themePreference)) {
      setThemePreferenceState(user.theme_preference || user.themePreference);
    }
  }, [user]);

  const contextValue = useMemo(() => ({
    themePreference,
    resolvedTheme,
    isThemeLoading,
    setThemePreference,
    refreshTheme
  }), [themePreference, resolvedTheme, isThemeLoading, setThemePreference, refreshTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
