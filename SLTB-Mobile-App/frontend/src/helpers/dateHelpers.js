/**
 * Date Helpers
 * ─────────────────────────────────────────────────────────────────
 * Application-aware date formatting using date-fns.
 * All functions follow the DATE_FORMATS constants.
 *
 * Usage:
 *   import { formatAlertTime, formatDisplayDate } from '@helpers';
 */

import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { DATE_FORMATS } from '@constants';

/**
 * Format a date string for display in list items.
 * Shows relative time for recent dates, full date for older ones.
 * @param {string|Date} date — ISO 8601 string or Date object
 * @returns {string}
 */
export const formatRelativeDate = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return formatDistanceToNow(d, { addSuffix: true });
  if (isYesterday(d)) return `Yesterday, ${format(d, DATE_FORMATS.TIME_ONLY)}`;
  return format(d, DATE_FORMATS.DISPLAY_TIME);
};

/**
 * Format a date for standard display.
 * @param {string|Date} date
 * @returns {string} e.g. "01 Aug 2024"
 */
export const formatDisplayDate = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, DATE_FORMATS.DISPLAY);
};

/**
 * Format a date with time for detail views.
 * @param {string|Date} date
 * @returns {string} e.g. "01 Aug 2024, 14:30"
 */
export const formatDisplayDateTime = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, DATE_FORMATS.DISPLAY_TIME);
};

/**
 * Format time only.
 * @param {string|Date} date
 * @returns {string} e.g. "14:30"
 */
export const formatTime = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, DATE_FORMATS.TIME_ONLY);
};

/**
 * Format a date for API requests.
 * @param {Date} date
 * @returns {string} ISO 8601 format
 */
export const formatForApi = (date) => {
  return format(date, DATE_FORMATS.API);
};
