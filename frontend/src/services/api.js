import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach admin JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clubsphere_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      if (localStorage.getItem('clubsphere_admin_token')) {
        localStorage.removeItem('clubsphere_admin_token');
        localStorage.removeItem('clubsphere_admin_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
