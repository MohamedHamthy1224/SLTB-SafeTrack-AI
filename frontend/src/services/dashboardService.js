import apiClient from './apiClient';

export const dashboardService = {
  getOverview: async () => {
    return await apiClient.get('/sltb/dashboard');
  },

  getDashboardData: async () => {
    return await apiClient.get('/sltb/dashboard');
  },

  getPublicStats: async () => {
    return await apiClient.get('/public/statistics');
  }
};

export default dashboardService;
