/**
 * useTheme — Custom Theme Hook
 * ─────────────────────────────────────────────────────────────────
 * Convenience wrapper over useThemeContext.
 * Returns the active colors and theme mode flag.
 *
 * Usage:
 *   import { useTheme } from '@hooks';
 *   const { colors, isDark } = useTheme();
 *   <View style={{ backgroundColor: colors.background }} />
 */

import { useThemeContext } from '@contexts';

const useTheme = () => {
  return useThemeContext();
};

export default useTheme;
