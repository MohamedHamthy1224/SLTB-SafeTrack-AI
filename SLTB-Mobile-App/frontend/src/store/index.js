/**
 * Store — Barrel Export
 * ─────────────────────────────────────────────────────────────────
 * Central export for all Zustand stores.
 * Import from '@store' anywhere in the app.
 */

export { default as useAuthStore } from './authStore';
export { default as useUIStore }   from './uiStore';

// Phase 3+: Uncomment as stores are built
// export { default as useAlertsStore }       from './alertsStore';
// export { default as useNotificationStore } from './notificationStore';
