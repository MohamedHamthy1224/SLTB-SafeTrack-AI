import apiClient from './apiClient';

export const dashboardService = {
  getPublicStats: async () => {
    return await apiClient.get('/public/statistics');
  },

  getDashboardData: async () => {
    return await apiClient.get('/sltb/dashboard');
  }
};
