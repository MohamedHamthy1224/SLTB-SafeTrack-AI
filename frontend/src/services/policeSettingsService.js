import apiClient from './apiClient';

export const policeSettingsService = {
  getThemePreference: async () => {
    const response = await apiClient.get('/police/settings/theme');
    return response.data;
  },

  updateThemePreference: async (themePreference) => {
    const response = await apiClient.put('/police/settings/theme', { themePreference });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/police/settings/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    let response;
    if (profileData instanceof FormData) {
      response = await apiClient.put('/police/settings/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await apiClient.put('/police/settings/profile', profileData);
    }
    return response.data;
  },

  uploadProfilePhoto: async (formData) => {
    const response = await apiClient.post('/police/settings/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePassword: async (passwordData) => {
    const response = await apiClient.put('/police/settings/password', passwordData);
    return response.data;
  },
};

export default policeSettingsService;
