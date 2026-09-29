import apiClient from './apiClient';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const policeUTurnManagementService = {
  getAllUTurnUnits: async (params = {}) => {
    return apiClient.get('/police/u-turn-management', { params });
  },

  getSummary: async () => {
    return apiClient.get('/police/u-turn-management/summary');
  },

  searchUTurnUnits: async (keyword, extraParams = {}) => {
    return apiClient.get('/police/u-turn-management/search', {
      params: { keyword, ...extraParams }
    });
  },

  getStatuses: async () => {
    return apiClient.get('/police/u-turn-management/statuses');
  },

  getRoutes: async () => {
    return apiClient.get('/police/u-turn-management/routes');
  },

  getDevices: async () => {
    return apiClient.get('/police/u-turn-management/devices');
  },

  getUTurnUnitById: async (id) => {
    return apiClient.get(`/police/u-turn-management/${id}`);
  },

  createUTurnUnit: async (payload) => {
    return apiClient.post('/police/u-turn-management', payload);
  },

  updateUTurnUnit: async (id, payload) => {
    return apiClient.put(`/police/u-turn-management/${id}`, payload);
  },

  deactivateUTurnUnit: async (id) => {
    return apiClient.put(`/police/u-turn-management/${id}/inactive`);
  },

  // Alias used by UTurnManagementPage
  deactivateUnit: async (id) => {
    return apiClient.put(`/police/u-turn-management/${id}/inactive`);
  },

  exportPdf: async (params = {}) => {
    const token = localStorage.getItem('sltb_auth_token');
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/police/u-turn-management/export/pdf${query ? '?' + query : ''}`;

    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `SLTB_SafeTrack_UTurn_Units_${new Date().toISOString().slice(0, 10)}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  }
};

export default policeUTurnManagementService;
