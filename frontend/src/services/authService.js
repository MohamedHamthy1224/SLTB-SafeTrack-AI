import apiClient from './apiClient';

export const authService = {
  login: async (identifier, password) => {
    return await apiClient.post('/auth/login', { identifier, password });
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.warn('Logout API notification failed', e);
    } finally {
      localStorage.removeItem('sltb_auth_token');
      localStorage.removeItem('sltb_user_data');
    }
  },

  checkSession: async () => {
    return await apiClient.get('/auth/session');
  },

  requestPasswordReset: async (email) => {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token, new_password, confirm_password) => {
    return await apiClient.post('/auth/reset-password', { token, new_password, confirm_password });
  }
};
