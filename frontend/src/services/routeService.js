import apiClient from './apiClient';

export const routeService = {
  getSummary: async () => {
    return await apiClient.get('/sltb/routes/summary');
  },

  getFilterOptions: async () => {
    return await apiClient.get('/sltb/routes/filter-options');
  },

  getStatusOptions: async () => {
    return await apiClient.get('/sltb/routes/status-options');
  },

  getRoutes: async (params = {}) => {
    return await apiClient.get('/sltb/routes', { params });
  },

  getRouteDetails: async (routeId) => {
    return await apiClient.get(`/sltb/routes/${routeId}`);
  },

  createRoute: async (payload) => {
    return await apiClient.post('/sltb/routes', payload);
  },

  updateRoute: async (routeId, payload) => {
    return await apiClient.put(`/sltb/routes/${routeId}`, payload);
  },

  deactivateRoute: async (routeId) => {
    return await apiClient.patch(`/sltb/routes/${routeId}/deactivate`);
  },

  getRouteOptions: async () => {
    return await apiClient.get('/sltb/routes/options');
  }
};

export default routeService;
