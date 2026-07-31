import apiClient from './apiClient';

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
    const query = new URLSearchParams(params).toString();
    const token = localStorage.getItem('sltb_auth_token');
    const response = await fetch(`http://localhost:5001/api/v1/users/export?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to export users.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_management_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};

export default userService;
