// lib/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  withCredentials: true // Important for sending cookies
});

// Function to refresh the token
const refreshToken = async () => {
  try {
    const response = await axiosInstance.post('/api/token/refresh/');
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add any request modifications here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (status 401) and we haven't tried to refresh yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await refreshToken();

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refreshing fails, redirect to login or dispatch a logout action
        console.error('Token refresh failed:', refreshError);

        // You can dispatch a logout action here or redirect to login
        // For example:
        // window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
