import apiClient from './apiClient';

export const policeDashboardService = {
  getDashboardData: async (params = {}) => {
    return apiClient.get('/police/dashboard', { params });
  },

  getAlertsChart: async (period = 'This Week') => {
    return apiClient.get('/police/dashboard/charts', { params: { period } });
  },

  getSafetyMonitors: async () => {
    return apiClient.get('/police/dashboard/safety-monitors');
  }
};

export default policeDashboardService;
