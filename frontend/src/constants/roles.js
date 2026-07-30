export const USER_ROLES = {
  POLICE_ADMIN: 'Police Admin',
  TRAFFIC_POLICE_OFFICER: 'Traffic Police Officer',
  SLTB_ADMIN: 'SLTB Admin',
  
  // Future web module expansion roles
  DRIVER: 'Driver',
  CONDUCTOR: 'Conductor',
  MAINTENANCE: 'Maintenance'
};

export const MOBILE_ONLY_ROLES = [
  USER_ROLES.TRAFFIC_POLICE_OFFICER
];

export const DASHBOARD_ROUTES = {
  [USER_ROLES.SLTB_ADMIN]: '/sltb/dashboard',
  [USER_ROLES.POLICE_ADMIN]: '/police/dashboard'
};

export const MODULE_NAMES = {
  SLTB: 'SLTB',
  POLICE: 'Police',
  PUBLIC: 'Public'
};

export const ROLE_MODULE_MAP = {
  [USER_ROLES.SLTB_ADMIN]: MODULE_NAMES.SLTB,
  [USER_ROLES.POLICE_ADMIN]: MODULE_NAMES.POLICE
};
