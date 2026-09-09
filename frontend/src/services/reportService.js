import apiClient from './apiClient';

export const reportService = {
  // Buses Report
  getBusesReport: (params) => apiClient.get('/sltb/reports/buses', { params }),
  getBusesOptions: () => apiClient.get('/sltb/reports/buses/options'),
  exportBusesPDF: (params) =>
    apiClient.get('/sltb/reports/buses/export/pdf', {
      params,
      responseType: 'blob'
    }),
  exportBusesCSV: (params) =>
    apiClient.get('/sltb/reports/buses/export', {
      params,
      responseType: 'blob'
    }),

  // Routes Report
  getRoutesReport: (params) => apiClient.get('/sltb/reports/routes', { params }),
  getRoutesOptions: () => apiClient.get('/sltb/reports/routes/options'),
  exportRoutesPDF: (params) =>
    apiClient.get('/sltb/reports/routes/export/pdf', {
      params,
      responseType: 'blob'
    }),
  exportRoutesCSV: (params) =>
    apiClient.get('/sltb/reports/routes/export', {
      params,
      responseType: 'blob'
    }),

  // Drivers Report
  getDriversReport: (params) => apiClient.get('/sltb/reports/drivers', { params }),
  getDriversOptions: () => apiClient.get('/sltb/reports/drivers/options'),
  exportDriversPDF: (params) =>
    apiClient.get('/sltb/reports/drivers/export/pdf', {
      params,
      responseType: 'blob'
    }),
  exportDriversCSV: (params) =>
    apiClient.get('/sltb/reports/drivers/export', {
      params,
      responseType: 'blob'
    }),

  // Assignment History Report
  getAssignmentHistoryReport: (params) => apiClient.get('/sltb/reports/assignment-history', { params }),
  exportAssignmentHistoryPDF: (params) =>
    apiClient.get('/sltb/reports/assignment-history/export/pdf', {
      params,
      responseType: 'blob'
    }),
  exportAssignmentHistoryCSV: (params) =>
    apiClient.get('/sltb/reports/assignment-history/export', {
      params,
      responseType: 'blob'
    }),

  // Sensors and Alerts Report
  getSensorsAlertsReport: (params) => apiClient.get('/sltb/reports/sensors-alerts', { params }),
  getSensorsAlertsOptions: () => apiClient.get('/sltb/reports/sensors-alerts/options'),
  exportSensorsAlertsPDF: (params) =>
    apiClient.get('/sltb/reports/sensors-alerts/export/pdf', {
      params,
      responseType: 'blob'
    }),
  exportSensorsAlertsCSV: (params) =>
    apiClient.get('/sltb/reports/sensors-alerts/export', {
      params,
      responseType: 'blob'
    })
};

export default reportService;
