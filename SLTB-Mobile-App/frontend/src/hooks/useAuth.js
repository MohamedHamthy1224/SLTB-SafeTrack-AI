/**
 * useAuth — Custom Auth Hook
 * ─────────────────────────────────────────────────────────────────
 * Convenience wrapper over useAuthContext.
 * Components should import this hook, not useAuthContext directly.
 *
 * Usage:
 *   import { useAuth } from '@hooks';
 *   const { user, isAuthenticated, logout } = useAuth();
 */

import { useAuthContext } from '@contexts';

const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
