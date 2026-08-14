/**
 * Auth Service
 * ─────────────────────────────────────────────────────────────────
 * Handles authentication API calls to the Laravel backend.
 */

import apiClient from '../api/client';

const authService = {
  /**
   * Send login credentials to Laravel backend.
   * @param {Object} credentials - { email / username, password }
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Log out active officer session.
   */
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (_err) {
      return { success: true };
    }
  },
};

export default authService;
