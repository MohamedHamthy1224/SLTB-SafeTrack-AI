/**
 * App Constants — Index
 * ─────────────────────────────────────────────────────────────────
 * Central export for all application-wide constants.
 *
 * Categories:
 *   - API_ENDPOINTS     — All backend API route paths
 *   - APP_ROUTES        — React Navigation screen names
 *   - STORAGE_KEYS      — AsyncStorage / SecureStore key names
 *   - ALERT_TYPES       — Traffic alert type identifiers
 *   - ALERT_STATUS      — Alert lifecycle statuses
 *   - ALERT_PRIORITY    — Alert severity levels
 *   - OFFICER_RANKS     — Police rank enumeration
 *   - DATE_FORMATS      — Standardized date format strings
 *   - PAGINATION        — Default page size values
 *
 * NOTE: Populate these as features are built.
 */

// ─────────────────────────────────────────────────────────────────
// App Route Names
// ─────────────────────────────────────────────────────────────────
export const APP_ROUTES = {
  // Auth Stack
  LOGIN:            'Login',
  FORGOT_PASSWORD:  'ForgotPassword',

  // App Stack — Bottom Tabs
  DASHBOARD:        'Dashboard',
  ALERTS:           'Alerts',
  HISTORY:          'History',
  PROFILE:          'Profile',

  // Modal Screens
  ALERT_DETAILS:    'AlertDetails',
  EDIT_PROFILE:     'EditProfile',
  CHANGE_PASSWORD:  'ChangePassword',
};

// ─────────────────────────────────────────────────────────────────
// Secure Storage Keys
// ─────────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN:       'sltb_auth_token',
  REFRESH_TOKEN:    'sltb_refresh_token',
  USER_DATA:        'sltb_user_data',
  PREFERENCES:      'sltb_preferences',
  ONBOARDED:        'sltb_onboarded',
};

// ─────────────────────────────────────────────────────────────────
// Alert Priority Levels
// ─────────────────────────────────────────────────────────────────
export const ALERT_PRIORITY = {
  CRITICAL: 'critical',
  HIGH:     'high',
  MEDIUM:   'medium',
  LOW:      'low',
};

// ─────────────────────────────────────────────────────────────────
// Alert Status Values
// ─────────────────────────────────────────────────────────────────
export const ALERT_STATUS = {
  NEW:         'new',
  ACKNOWLEDGED: 'acknowledged',
  IN_PROGRESS: 'in_progress',
  RESOLVED:    'resolved',
  ESCALATED:   'escalated',
  DISMISSED:   'dismissed',
};

// ─────────────────────────────────────────────────────────────────
// Alert Types
// ─────────────────────────────────────────────────────────────────
export const ALERT_TYPES = {
  SPEEDING:         'speeding',
  WRONG_WAY:        'wrong_way',
  DANGEROUS_DRIVING: 'dangerous_driving',
  BREAKDOWN:        'breakdown',
  ACCIDENT:         'accident',
  ROUTE_DEVIATION:  'route_deviation',
  OVERLOADING:      'overloading',
  ILLEGAL_STOP:     'illegal_stop',
};

// ─────────────────────────────────────────────────────────────────
// Pagination Defaults
// ─────────────────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE:     1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE:     100,
};

// ─────────────────────────────────────────────────────────────────
// Date Format Strings
// ─────────────────────────────────────────────────────────────────
export const DATE_FORMATS = {
  DISPLAY:        'dd MMM yyyy',
  DISPLAY_TIME:   'dd MMM yyyy, HH:mm',
  TIME_ONLY:      'HH:mm',
  API:            "yyyy-MM-dd'T'HH:mm:ss",
  DATE_ONLY:      'yyyy-MM-dd',
};
