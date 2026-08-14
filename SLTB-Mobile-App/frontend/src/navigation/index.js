/**
 * Navigation — Barrel Export
 * ─────────────────────────────────────────────────────────────────
 * Central export for all navigation components and utilities.
 * Import from '@navigation' anywhere in the app.
 */

export { default as RootNavigator } from './RootNavigator';
export { default as AuthStack }     from './AuthStack';
export { default as AppStack }      from './AppStack';
export {
  navigationRef,
  navigate,
  resetTo,
  resetToLogin,
  resetToDashboard,
  goBack,
} from './navigationRef';
