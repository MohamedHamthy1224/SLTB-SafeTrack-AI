/**
 * Shared Utilities — Index
 * ─────────────────────────────────────────────────────────────────
 * Pure utility functions shared across the project.
 * These have zero platform-specific dependencies.
 *
 * Planned Utilities:
 *   - formatDate(date, format)      — Format date strings
 *   - truncateText(text, maxLength) — Truncate long strings
 *   - capitalize(str)               — Capitalize first letter
 *   - isValidEmail(email)           — Validate email format
 *   - generateId()                  — Generate unique identifiers
 *   - deepClone(obj)                — Deep clone objects
 *   - debounce(fn, delay)           — Debounce function calls
 *   - throttle(fn, limit)           — Throttle function calls
 *
 * NOTE: Populate as utilities are identified during development.
 */

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate text to a maximum length with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
};

/**
 * Validate email format.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate a simple unique ID string.
 * @returns {string}
 */
const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

module.exports = {
  capitalize,
  truncateText,
  isValidEmail,
  generateId,
};
