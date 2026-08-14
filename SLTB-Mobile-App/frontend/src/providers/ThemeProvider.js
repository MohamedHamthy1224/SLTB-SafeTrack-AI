/**
 * ThemeProvider
 * ─────────────────────────────────────────────────────────────────
 * Combines React Native Paper's PaperProvider with our custom
 * ThemeContextProvider and React Native's built-in appearance system.
 *
 * Why this wrapper?
 *   - PaperProvider needs our custom theme colors
 *   - ThemeContextProvider supplies our design tokens to the tree
 *   - Combining both here keeps AppProvider clean
 */

import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { ThemeContextProvider } from '@contexts';
import { PaperTheme } from '@theme';

/**
 * ThemeProvider
 * Must wrap the NavigationContainer so Paper components can inherit the theme.
 */
const ThemeProvider = ({ children }) => {
  return (
    <ThemeContextProvider>
      <PaperProvider theme={PaperTheme}>
        {children}
      </PaperProvider>
    </ThemeContextProvider>
  );
};

export default ThemeProvider;
