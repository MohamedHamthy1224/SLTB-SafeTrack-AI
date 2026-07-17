import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/v1';

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
      if (window.location.pathname.startsWith('/sltb')) {
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error.response ? error.response.data : { message: 'Network connection error.' });
  }
);

export default apiClient;
