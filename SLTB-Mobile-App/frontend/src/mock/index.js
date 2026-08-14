/**
 * Mock Data — Index
 * ─────────────────────────────────────────────────────────────────
 * Mock data for local development and UI testing.
 *
 * Use these mock data sets to build and test UI components before
 * the Laravel backend APIs are connected.
 *
 * Files (to be created):
 *   - mockUser.js         — Mock officer profile data
 *   - mockAlerts.js       — Mock alert list and detail objects
 *   - mockHistory.js      — Mock historical record data
 *   - mockDashboard.js    — Mock dashboard statistics
 *
 * NOTE: Remove mock data usage before production deployment.
 */

// export { mockUser } from './mockUser';
// export { mockAlerts, mockAlertDetail } from './mockAlerts';
// export { mockHistory } from './mockHistory';
// export { mockDashboardStats } from './mockDashboard';

// ─────────────────────────────────────────────────────────────────
// Mock Officer Profile
// ─────────────────────────────────────────────────────────────────
export const mockUser = {
  id:           1,
  name:         'P.C. Kumara Bandara',
  badge_number: 'WP-2024-0147',
  rank:         'Police Constable',
  unit:         'Western Province Traffic Division',
  station:      'Colombo Central Police Station',
  email:        'kumara.bandara@police.lk',
  phone:        '+94 77 123 4567',
  avatar:       null,
  status:       'active',
  joined_at:    '2019-03-15',
};

// ─────────────────────────────────────────────────────────────────
// Mock Alerts
// ─────────────────────────────────────────────────────────────────
export const mockAlerts = [
  {
    id:           1,
    type:         'speeding',
    priority:     'critical',
    status:       'new',
    bus_number:   'WP-CAA-1234',
    route:        '138 — Colombo to Gampaha',
    location:     'Baseline Road Junction, Colombo 09',
    description:  'Bus detected traveling at 87 km/h in a 50 km/h zone.',
    ai_confidence: 0.97,
    created_at:   '2024-08-01T13:45:00Z',
  },
  {
    id:           2,
    type:         'dangerous_driving',
    priority:     'high',
    status:       'acknowledged',
    bus_number:   'NC-2314',
    route:        '72 — Kandy to Matale',
    location:     'Katugastota Bridge, Kandy',
    description:  'Erratic lane changes detected. Possible driver fatigue.',
    ai_confidence: 0.89,
    created_at:   '2024-08-01T12:30:00Z',
  },
];
