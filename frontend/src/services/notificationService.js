/**
 * notificationService.js
 * ----------------------
 * Fetches notifications for the authenticated police officer.
 * Uses the existing apiClient (Axios instance with JWT interceptor).
 */

import apiClient from './apiClient';

const notificationService = {
  /**
   * Fetch recent notifications for the logged-in police officer.
   * The backend joins notification_recipients → notifications
   * and filters by the officer linked to the authenticated user.
   *
   * @param {number} limit - Max number of notifications to return (default 10, max 50)
   * @returns {Promise} Resolves with array of notification objects
   */
  getMyNotifications: async (limit = 10) => {
    return apiClient.get('/police/notifications', {
      params: { limit }
    });
  }
};

export default notificationService;
