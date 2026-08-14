/**
 * Auth Store — Zustand
 * ─────────────────────────────────────────────────────────────────
 * Global auth state managed with Zustand.
 * Used for state that needs to be accessed without React Context
 * (e.g., inside Axios interceptors).
 *
 * NOTE: AuthContext is the primary auth state for components.
 *       authStore is for non-component usage (services, interceptors).
 *
 * Usage:
 *   import { useAuthStore } from '@store';
 *   const token = useAuthStore.getState().token;      // Outside React
 *   const { token } = useAuthStore();                 // Inside React
 */

import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token:           null,
  refreshToken:    null,
  user:            null,
  isAuthenticated: false,

  setToken: (token) =>
    set({ token, isAuthenticated: Boolean(token) }),

  setRefreshToken: (refreshToken) =>
    set({ refreshToken }),

  setUser: (user) =>
    set({ user }),

  setAuth: ({ token, refreshToken, user }) =>
    set({ token, refreshToken, user, isAuthenticated: Boolean(token) }),

  clearAuth: () =>
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false }),
}));

export default useAuthStore;
