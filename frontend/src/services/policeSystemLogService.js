import apiClient from './apiClient';

export const policeSystemLogService = {
  getLogs: async (params = {}) => {
    return apiClient.get('/police/system-logs', { params });
  },

  getSummary: async () => {
    return apiClient.get('/police/system-logs/summary');
  },

  getUserOptions: async () => {
    return apiClient.get('/police/system-logs/users');
  },

  getActivityByDay: async () => {
    return apiClient.get('/police/system-logs/activity-by-day');
  },

  getUserDistribution: async () => {
    return apiClient.get('/police/system-logs/user-distribution');
  },

  getRecentActivities: async (limit = 10) => {
    return apiClient.get('/police/system-logs/recent', { params: { limit } });
  },

  getSessions: async () => {
    return apiClient.get('/police/system-logs/sessions');
  },

  exportPdf: async (params = {}) => {
    const response = await apiClient.get('/police/system-logs/export/pdf', {
      params,
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `system_logs_report_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  },
};

export default policeSystemLogService;
