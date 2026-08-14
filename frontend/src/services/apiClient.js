import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sltb_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthenticated / Expired Sessions
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('sltb_auth_token');
      localStorage.removeItem('sltb_user_data');
      if (window.location.pathname.startsWith('/sltb') || window.location.pathname.startsWith('/police')) {
        window.location.href = '/login?expired=1';
      }
    }
    if (error.response) {
      const data = error.response.data || {};
      return Promise.reject({
        status: error.response.status,
        message: data.message || `API Request Failed (Status ${error.response.status})`,
        errors: data.errors || null
      });
    }
    return Promise.reject({
      status: 0,
      message: 'Network connection error. Server is unreachable.'
    });
  }
);

export default apiClient;
