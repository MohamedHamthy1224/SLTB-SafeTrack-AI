import apiClient from './apiClient';

export const profileService = {
  getProfile: async () => {
    return await apiClient.get('/sltb/profile');
  },

  updateProfile: async (formData) => {
    return await apiClient.put('/sltb/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updatePassword: async (payload) => {
    return await apiClient.patch('/sltb/profile/password', payload);
  }
};

export default profileService;
