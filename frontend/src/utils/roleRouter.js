import { USER_ROLES, DASHBOARD_ROUTES, ROLE_MODULE_MAP, MOBILE_ONLY_ROLES } from '../constants/roles';

/**
 * Determines the destination dashboard route for a given user role.
 * @param {string} roleName 
 * @returns {string} Relative dashboard URL path
 */
export const getDashboardRoute = (roleName) => {
  if (!roleName) return '/login';
  if (DASHBOARD_ROUTES[roleName]) {
    return DASHBOARD_ROUTES[roleName];
  }
  return '/unauthorized';
};

/**
 * Returns the active module name based on user role.
 * @param {string} roleName 
 * @returns {string} Module name ('SLTB', 'Police', etc.)
 */
export const getActiveModule = (roleName) => {
  if (!roleName) return null;
  return ROLE_MODULE_MAP[roleName] || 'General';
};

/**
 * Checks if a user role is restricted to Mobile application only.
 * @param {string} roleName 
 * @returns {boolean}
 */
export const isMobileOnlyRole = (roleName) => {
  if (!roleName) return false;
  return MOBILE_ONLY_ROLES.includes(roleName) || roleName.includes('Police Officer');
};
