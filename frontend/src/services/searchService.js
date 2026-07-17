import apiClient from './apiClient';

export const searchService = {
  globalSearch: async (query) => {
    return await apiClient.get(`/sltb/search?q=${encodeURIComponent(query)}`);
  }
};
