import apiClient from './apiClient';

export const busService = {
  getSummary: async () => {
    return await apiClient.get('/sltb/buses/summary');
  },

  getFilterOptions: async () => {
    return await apiClient.get('/sltb/buses/filter-options');
  },

  getBuses: async (params = {}) => {
    return await apiClient.get('/sltb/buses', { params });
  },

  getBusDetails: async (busId) => {
    return await apiClient.get(`/sltb/buses/${busId}`);
  },

  createBus: async (payload) => {
    return await apiClient.post('/sltb/buses', payload);
  },

  updateBus: async (busId, payload) => {
    return await apiClient.put(`/sltb/buses/${busId}`, payload);
  }
};

export default busService;
