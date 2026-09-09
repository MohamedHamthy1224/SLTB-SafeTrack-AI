import apiClient from './apiClient';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const userService = {
  getUsers: async (params = {}) => {
    return await apiClient.get('/users', { params });
  },

  getUserSummary: async () => {
    return await apiClient.get('/users/summary');
  },

  getUserById: async (userId) => {
    return await apiClient.get(`/users/${userId}`);
  },

  createUser: async (userData) => {
    return await apiClient.post('/users', userData);
  },

  updateUser: async (userId, userData) => {
    return await apiClient.put(`/users/${userId}`, userData);
  },

  deleteUser: async (userId) => {
    return await apiClient.delete(`/users/${userId}`);
  },

  exportUsers: async (params = {}) => {
    const token = localStorage.getItem('sltb_auth_token');
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/police/users/export/pdf${query ? '?' + query : ''}`;

    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `SLTB_SafeTrack_User_Management_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  }
};

export default userService;
