import apiClient from './apiClient';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const policeBusAlertService = {
  getAlerts: async (params = {}) => {
    return apiClient.get('/police/bus-alerts', { params });
  },

  getAlertById: async (id) => {
    return apiClient.get(`/police/bus-alerts/${id}`);
  },

  getSummary: async () => {
    return apiClient.get('/police/bus-alerts/summary');
  },

  getRecent: async (limit = 5) => {
    return apiClient.get('/police/bus-alerts/recent', { params: { limit } });
  },

  getCharts: async () => {
    return apiClient.get('/police/bus-alerts/charts');
  },

  exportPdf: async (priority = null, filters = {}) => {
    const token = localStorage.getItem('sltb_auth_token');
    const params = { ...filters };
    if (priority && priority.toLowerCase() !== 'all') {
      params.priority = priority;
    }

    const response = await axios.get(`${API_BASE_URL}/police/bus-alerts/export/pdf`, {
      params,
      responseType: 'blob',
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SLTB_SafeTrack_Bus_Alerts_${new Date().toISOString().slice(0, 10)}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  }
};

export default policeBusAlertService;
