import apiClient from './apiClient';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const policeUTurnUnitService = {
  getUnits: async (params = {}) => {
    return apiClient.get('/police/uturn-units', { params });
  },

  getSummary: async () => {
    return apiClient.get('/police/uturn-units/summary');
  },

  exportPdf: async (params = {}) => {
    const token = localStorage.getItem('sltb_auth_token');
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/police/uturn-units/export/pdf${query ? '?' + query : ''}`;

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

export default policeUTurnUnitService;
