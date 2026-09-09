import apiClient from './apiClient';

export const policeDeviceService = {
  getDevices: async (params = {}) => {
    return apiClient.get('/police/devices', { params });
  },

  getSummary: async () => {
    return apiClient.get('/police/devices/summary');
  },

  getDeviceTypes: async () => {
    return apiClient.get('/police/devices/types');
  },

  getDeviceStatuses: async () => {
    return apiClient.get('/police/devices/statuses');
  },

  getBusStatuses: async () => {
    return apiClient.get('/police/devices/bus-statuses');
  },

  getBuses: async () => {
    return apiClient.get('/police/devices/buses');
  },

  getDeviceById: async (deviceId) => {
    return apiClient.get(`/police/devices/${deviceId}`);
  },

  createDevice: async (deviceData) => {
    return apiClient.post('/police/devices', deviceData);
  },

  updateDevice: async (deviceId, deviceData) => {
    return apiClient.put(`/police/devices/${deviceId}`, deviceData);
  },

  setDeviceInactive: async (deviceId) => {
    return apiClient.put(`/police/devices/${deviceId}/inactive`);
  },
};

export default policeDeviceService;
