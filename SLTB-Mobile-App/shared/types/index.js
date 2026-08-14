/**
 * Shared Type Definitions
 * ─────────────────────────────────────────────────────────────────
 * JSDoc type definitions shared across frontend and documentation.
 *
 * These act as the shared data contract between the mobile frontend
 * and the Laravel API.
 *
 * In a TypeScript project, these would be .d.ts interface files.
 * For JavaScript, JSDoc is used for IDE IntelliSense support.
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request succeeded
 * @property {string} message - Human-readable response message
 * @property {*} data - Response payload
 * @property {Object} meta - Response metadata
 * @property {string} meta.timestamp - ISO 8601 timestamp
 * @property {string} meta.version - API version
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {boolean} success
 * @property {Array} data - Array of items
 * @property {Object} pagination
 * @property {number} pagination.current_page
 * @property {number} pagination.last_page
 * @property {number} pagination.per_page
 * @property {number} pagination.total
 */

/**
 * @typedef {Object} PoliceOfficer
 * @property {number} id
 * @property {string} name - Full name
 * @property {string} badge_number - Unique badge/employee number
 * @property {string} rank - Officer rank
 * @property {string} unit - Assigned police unit
 * @property {string} station - Assigned police station
 * @property {string} email - Official email address
 * @property {string} phone - Contact number
 * @property {string|null} avatar_url - Profile photo URL
 * @property {'active'|'suspended'|'inactive'} status
 * @property {string} created_at - ISO 8601 timestamp
 */

/**
 * @typedef {Object} Alert
 * @property {number} id
 * @property {'speeding'|'wrong_way'|'dangerous_driving'|'breakdown'|'accident'|'route_deviation'|'overloading'|'illegal_stop'} type
 * @property {'critical'|'high'|'medium'|'low'} priority
 * @property {'new'|'acknowledged'|'in_progress'|'resolved'|'escalated'|'dismissed'} status
 * @property {string} bus_number - Bus registration number
 * @property {string} route - Bus route description
 * @property {string} location - Incident location description
 * @property {string} description - AI-generated alert description
 * @property {number} ai_confidence - AI confidence score (0.0 - 1.0)
 * @property {string} created_at - ISO 8601 timestamp
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} badge_number - Officer badge/employee number
 * @property {string} password - Account password
 * @property {boolean} [remember_me] - Whether to use long-lived token
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} access_token - JWT/Sanctum access token
 * @property {string} refresh_token - Refresh token
 * @property {number} expires_in - Token lifetime in seconds
 * @property {string} token_type - Token type (Bearer)
 */
