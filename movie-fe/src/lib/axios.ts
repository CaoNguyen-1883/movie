import axios, { type InternalAxiosRequestConfig } from 'axios';
import { refreshAuth } from '@/services/authApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add the auth token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const tokensString = localStorage.getItem('tokens');
    if (tokensString) {
      const tokens = JSON.parse(tokensString);
      const token = tokens?.access?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// A queue for requests that are waiting for a new token
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];
let isRefreshing = false;

// Function to process the queue
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };


    if (error.response?.status !== 401 || originalRequest.url === '/auth/refresh-token' || originalRequest._retry) {
      return Promise.reject(error.response?.data || 'Something went wrong');
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
      .then(token => {
        originalRequest.headers.Authorization = 'Bearer ' + token;
        return axiosInstance(originalRequest);
      })
      .catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const tokensString = localStorage.getItem('tokens');
    if (!tokensString) {
      isRefreshing = false;
      window.location.href = '/auth';
      return Promise.reject(error);
    }

    const currentTokens = JSON.parse(tokensString);
    const refreshToken = currentTokens?.refresh?.token;

    if (!refreshToken) {
      isRefreshing = false;
      window.location.href = '/auth';
      return Promise.reject(error);
    }
    
    try {
      const response = await refreshAuth({ refreshToken });

      const newTokens = response.data;
      
      localStorage.setItem('tokens', JSON.stringify(newTokens));
      
      originalRequest.headers.Authorization = `Bearer ${newTokens.access.token}`;
      
      processQueue(null, newTokens.access.token);

      return axiosInstance(originalRequest);
    } catch (refreshError: any) {
      processQueue(refreshError, null);
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      window.location.href = '/auth';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance; 