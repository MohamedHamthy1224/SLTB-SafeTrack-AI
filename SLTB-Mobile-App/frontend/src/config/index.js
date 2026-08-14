/**
 * App Configuration
 * ─────────────────────────────────────────────────────────────────
 * Centralized configuration loaded from Expo environment variables.
 *
 * All env vars must be prefixed with EXPO_PUBLIC_ to be accessible
 * in the Expo runtime (SDK 49+).
 *
 * Add new variables to .env and .env.example simultaneously.
 */

// ─────────────────────────────────────────────────────────────────
// API Configuration
// ─────────────────────────────────────────────────────────────────
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api',
  TIMEOUT:  parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT ?? '30000', 10),
};

// ─────────────────────────────────────────────────────────────────
// App Metadata
// ─────────────────────────────────────────────────────────────────
export const APP_CONFIG = {
  NAME:        'SLTB SafeTrack AI',
  VERSION:     process.env.EXPO_PUBLIC_APP_VERSION ?? '1.0.0',
  ENVIRONMENT: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  IS_DEV:      process.env.EXPO_PUBLIC_APP_ENV !== 'production',
  USE_MOCK:    process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true',
};

// ─────────────────────────────────────────────────────────────────
// Feature Flags
// ─────────────────────────────────────────────────────────────────
export const FEATURES = {
  PUSH_NOTIFICATIONS: process.env.EXPO_PUBLIC_FEATURE_PUSH_NOTIFICATIONS === 'true',
  BIOMETRIC_AUTH:     process.env.EXPO_PUBLIC_FEATURE_BIOMETRIC_AUTH === 'true',
  OFFLINE_MODE:       process.env.EXPO_PUBLIC_FEATURE_OFFLINE_MODE === 'true',
};

// ─────────────────────────────────────────────────────────────────
// Notification Configuration (Phase 3)
// ─────────────────────────────────────────────────────────────────
export const NOTIFICATION_CONFIG = {
  CHANNEL_ID:    'sltb_alerts',
  CHANNEL_NAME:  'SLTB Traffic Alerts',
  CHANNEL_DESC:  'Real-time traffic violation alerts from SLTB SafeTrack AI',
};
