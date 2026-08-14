/**
 * UI Store — Zustand
 * ─────────────────────────────────────────────────────────────────
 * Global UI state: loading indicators, modals, global messages.
 *
 * Usage:
 *   import { useUIStore } from '@store';
 *   const { isGlobalLoading, setGlobalLoading } = useUIStore();
 */

import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Global fullscreen loading overlay
  isGlobalLoading:    false,
  globalLoadingMsg:   'Loading...',

  setGlobalLoading: (loading, message = 'Loading...') =>
    set({ isGlobalLoading: loading, globalLoadingMsg: message }),

  // Unread notification count (Phase 3)
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  clearUnread: () => set({ unreadCount: 0 }),
}));

export default useUIStore;
