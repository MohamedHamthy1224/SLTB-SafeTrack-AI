/**
 * Contexts — Barrel Export
 * ─────────────────────────────────────────────────────────────────
 * Central export for all React Context definitions.
 * Import from '@contexts' anywhere in the app.
 */

export {
  ThemeContext,
  ThemeContextProvider,
  useThemeContext,
} from './ThemeContext';

export {
  AuthContext,
  AuthContextProvider,
  useAuthContext,
} from './AuthContext';
