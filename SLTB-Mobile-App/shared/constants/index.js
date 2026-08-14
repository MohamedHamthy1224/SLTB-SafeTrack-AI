/**
 * Shared Constants — Index
 * ─────────────────────────────────────────────────────────────────
 * Cross-platform shared constants usable by both frontend and
 * backend integration layers.
 *
 * These constants define values that must remain in sync across
 * the mobile app and the Laravel API.
 *
 * NOTE: These are shared definitions only.
 *       Do not import platform-specific libraries here.
 */

// ─────────────────────────────────────────────────────────────────
// Alert Priority Levels
// ─────────────────────────────────────────────────────────────────
const ALERT_PRIORITY = {
  CRITICAL: 'critical',
  HIGH:     'high',
  MEDIUM:   'medium',
  LOW:      'low',
};

// ─────────────────────────────────────────────────────────────────
// Alert Status Values
// ─────────────────────────────────────────────────────────────────
const ALERT_STATUS = {
  NEW:           'new',
  ACKNOWLEDGED:  'acknowledged',
  IN_PROGRESS:   'in_progress',
  RESOLVED:      'resolved',
  ESCALATED:     'escalated',
  DISMISSED:     'dismissed',
};

// ─────────────────────────────────────────────────────────────────
// Alert Types (matching backend enum)
// ─────────────────────────────────────────────────────────────────
const ALERT_TYPES = {
  SPEEDING:           'speeding',
  WRONG_WAY:          'wrong_way',
  DANGEROUS_DRIVING:  'dangerous_driving',
  BREAKDOWN:          'breakdown',
  ACCIDENT:           'accident',
  ROUTE_DEVIATION:    'route_deviation',
  OVERLOADING:        'overloading',
  ILLEGAL_STOP:       'illegal_stop',
};

// ─────────────────────────────────────────────────────────────────
// Officer Ranks
// ─────────────────────────────────────────────────────────────────
const OFFICER_RANKS = {
  POLICE_CONSTABLE:  'Police Constable',
  LANCE_CORPORAL:    'Lance Corporal',
  CORPORAL:          'Corporal',
  SERGEANT:          'Sergeant',
  STAFF_SERGEANT:    'Staff Sergeant',
  SUB_INSPECTOR:     'Sub Inspector',
  INSPECTOR:         'Inspector',
  CHIEF_INSPECTOR:   'Chief Inspector',
  SUPERINTENDENT:    'Superintendent',
};

module.exports = {
  ALERT_PRIORITY,
  ALERT_STATUS,
  ALERT_TYPES,
  OFFICER_RANKS,
};
