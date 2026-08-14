/**
 * ThemeContext
 * ─────────────────────────────────────────────────────────────────
 * Provides the active color scheme (dark/light) and toggle function
 * to all child components via React Context.
 *
 * Usage:
 *   import { useThemeContext } from '@contexts';
 *   const { isDark, colors, toggleTheme } = useThemeContext();
 */

import React, { createContext, useContext, useState } from 'react';
import { Colors } from '@theme';

const ThemeContext = createContext(null);

/**
 * ThemeContextProvider
 * Wrap your app (or a subtree) with this to provide theme state.
 */
export const ThemeContextProvider = ({ children }) => {
  // Phase 2: dark mode only. Light mode toggle can be added in Phase 4.
  const [isDark] = useState(true);

  const value = {
    isDark,
    colors: Colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useThemeContext
 * Consume the ThemeContext. Must be used inside <ThemeContextProvider>.
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};

export default ThemeContext;
