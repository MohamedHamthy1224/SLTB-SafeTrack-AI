/**
 * Error Helpers
 * ─────────────────────────────────────────────────────────────────
 * Utilities for extracting and formatting error messages from
 * Axios errors, Laravel validation responses, and general errors.
 *
 * Usage:
 *   import { extractErrorMessage, extractValidationErrors } from '@helpers';
 *   const msg = extractErrorMessage(error);
 */

/**
 * Extract a human-readable error message from any error type.
 * Handles Axios errors, Laravel API errors, and plain Error objects.
 *
 * @param {Error|Object} error
 * @param {string} fallback — Message to show if nothing specific is found
 * @returns {string}
 */
export const extractErrorMessage = (error, fallback = 'An unexpected error occurred.') => {
  // Network error (no response — server unreachable)
  if (error?.message === 'Network Error' || !error?.response) {
    return 'Unable to connect to the server. Please check your network.';
  }

  const status = error?.response?.status;
  const data = error?.response?.data;

  // Laravel returns message in data.message
  if (data?.message) return data.message;

  // Laravel validation errors (422)
  if (status === 422 && data?.errors) {
    const firstField = Object.values(data.errors)[0];
    if (Array.isArray(firstField)) return firstField[0];
  }

  // HTTP status-based fallbacks
  switch (status) {
    case 400: return 'Bad request. Please check your input.';
    case 401: return 'Your session has expired. Please sign in again.';
    case 403: return 'You do not have permission to perform this action.';
    case 404: return 'The requested resource was not found.';
    case 422: return 'Validation failed. Please check your input.';
    case 429: return 'Too many requests. Please wait a moment and try again.';
    case 500: return 'A server error occurred. Please try again later.';
    case 503: return 'The service is temporarily unavailable. Please try again later.';
    default:  return fallback;
  }
};

/**
 * Extract Laravel validation errors as a flat key-value map.
 * Useful for mapping errors to form fields with react-hook-form.
 *
 * @param {Error} error — Axios error with 422 response
 * @returns {Object} e.g. { password: 'The password field is required.' }
 */
export const extractValidationErrors = (error) => {
  if (error?.response?.status !== 422) return {};
  const errors = error?.response?.data?.errors ?? {};
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : messages,
    ]),
  );
};

/**
 * Check if an Axios error is a network-level failure (no response).
 * @param {Error} error
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return !error?.response && error?.message === 'Network Error';
};
