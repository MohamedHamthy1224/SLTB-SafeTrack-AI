import apiClient from './apiClient';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const policeUTurnAlertService = {
  getAlerts: async (params = {}) => {
    return apiClient.get('/police/u-turn-alerts', { params });
  },

  getSummary: async () => {
    return apiClient.get('/police/u-turn-alerts/summary');
  },

  getPriorities: async () => {
    return apiClient.get('/police/u-turn-alerts/priorities');
  },

  getCharts: async () => {
    return apiClient.get('/police/u-turn-alerts/charts');
  },

  getRecentNotifications: async (limit = 5) => {
    return apiClient.get('/police/u-turn-alerts/recent', { params: { limit } });
  },

  getAlertById: async (alertId) => {
    return apiClient.get(`/police/u-turn-alerts/${alertId}`);
  },

  exportPdf: async (priority = null) => {
    const token = localStorage.getItem('sltb_auth_token');
    const params = priority && priority !== 'all' ? { priority } : {};
    
    const response = await axios.get(`${API_BASE_URL}/police/u-turn-alerts/export/pdf`, {
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
    link.setAttribute('download', `u_turn_alerts_${new Date().toISOString().slice(0, 10)}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  }
};

export default policeUTurnAlertService;
