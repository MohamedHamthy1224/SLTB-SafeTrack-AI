import apiClient from './apiClient';

export const driverService = {
  getSummary: async () => {
    return await apiClient.get('/sltb/drivers/summary');
  },

  getFilterOptions: async () => {
    return await apiClient.get('/sltb/drivers/filter-options');
  },

  getStatusOptions: async () => {
    return await apiClient.get('/sltb/drivers/status-options');
  },

  getDrivers: async (params = {}) => {
    return await apiClient.get('/sltb/drivers', { params });
  },

  getDriverById: async (driverId) => {
    return await apiClient.get(`/sltb/drivers/${driverId}`);
  },

  getAssignmentOptions: async (driverId) => {
    return await apiClient.get(`/sltb/drivers/${driverId}/assignment-options`);
  },

  createDriver: async (formData) => {
    return await apiClient.post('/sltb/drivers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updateDriver: async (driverId, formData) => {
    return await apiClient.put(`/sltb/drivers/${driverId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deactivateDriver: async (driverId) => {
    return await apiClient.patch(`/sltb/drivers/${driverId}/deactivate`);
  },

  getDriverOptions: async (params = {}) => {
    return await apiClient.get('/sltb/drivers/options', { params });
  }
};

export default driverService;
