import apiClient from './apiClient';

export const settingsService = {
  getThemePreference: async () => {
    return await apiClient.get('/sltb/settings/theme');
  },

  updateThemePreference: async (themePreference) => {
    return await apiClient.patch('/sltb/settings/theme', {
      theme_preference: themePreference
    });
  }
};

export default settingsService;
