/**
 * AppProvider
 * ─────────────────────────────────────────────────────────────────
 * Root provider that composes all application-level providers
 * in the correct dependency order.
 *
 * Provider nesting order (outermost → innermost):
 *
 *   QueryProvider          — React Query server-state cache
 *     ThemeProvider        — Design system + Paper UI kit
 *       AuthProvider       — Authentication state
 *         Toast            — Toast notification support
 *           {children}     — The rest of the app
 *
 * Why this order?
 *   - QueryProvider must be outermost so mutations in AuthProvider can use it
 *   - ThemeProvider must wrap AuthProvider so auth screens get theming
 *   - AuthProvider must wrap NavigationContainer children
 */

import React from 'react';
import Toast from 'react-native-toast-message';

import QueryProvider from './QueryProvider';
import ThemeProvider from './ThemeProvider';
import AuthProvider from './AuthProvider';

const AppProvider = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
          {/* Toast must be rendered LAST to appear on top of everything */}
          <Toast />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default AppProvider;
