/**
 * navigationRef
 * ─────────────────────────────────────────────────────────────────
 * A ref to the NavigationContainer that allows imperative navigation
 * from outside of React components (e.g., from services or interceptors).
 *
 * Usage:
 *   import { navigationRef, navigate } from '@navigation/navigationRef';
 *   navigate('Login');                   // Navigate to a screen
 *   resetToLogin();                      // Used after logout
 */

import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { APP_ROUTES } from '@constants';

// ─────────────────────────────────────────────────────────────────
// Navigation Container Reference
// ─────────────────────────────────────────────────────────────────
export const navigationRef = createNavigationContainerRef();

/**
 * Navigate to any screen by name.
 * Safe to call before the navigator is ready.
 */
export const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

/**
 * Reset navigation stack and navigate to a screen.
 * Used after login (clear auth stack) or logout (clear app stack).
 */
export const resetTo = (routeName, params = {}) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      }),
    );
  }
};

/**
 * Navigate to Login and clear the entire navigation history.
 * Called on logout.
 */
export const resetToLogin = () => resetTo(APP_ROUTES.LOGIN);

/**
 * Navigate to Dashboard and clear auth stack.
 * Called on successful login.
 */
export const resetToDashboard = () => resetTo(APP_ROUTES.DASHBOARD);

/**
 * Go back to the previous screen.
 */
export const goBack = () => {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
};
