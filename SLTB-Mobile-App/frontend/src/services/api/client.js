/**
 * Axios HTTP Client
 * ─────────────────────────────────────────────────────────────────
 * Configured Axios instance for all API communication.
 */

import axios from 'axios';
import { Platform } from 'react-native';
import { API_CONFIG } from '@config';
import storageService from '../storage/storageService';

const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      return `http://${window.location.hostname}:8000/api`;
    }
    return 'http://127.0.0.1:8000/api';
  }
  return API_CONFIG.BASE_URL || 'http://10.33.88.17:8000/api';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    'X-Client':     'SLTB-Mobile/1.0.0',
  },
});

// Request Interceptor — Injects the auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await storageService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (_err) {
      // Non-blocking
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
