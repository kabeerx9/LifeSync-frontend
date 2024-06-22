import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true // Important for sending cookies
});

// Function to refresh the token
const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    const response = await axiosInstance.post('/auth/token/refresh/', {
      refresh: refreshToken
    });
    const { access, refresh } = response.data;

    // Update the access token in cookies
    Cookies.set('accessToken', access, { expires: 1 / 24 }); // 1 hour
    Cookies.set('refreshToken', refresh, { expires: 1 }); // 1 day

    return access;
  } catch (error) {
    throw error;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status !== 200) {
      toast.error(error.response.data.message || 'An error occurred');
    }

    const originalRequest = error.config;

    // If the error is due to an expired token (status 401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const newAccessToken = await refreshToken();

        // Update the Authorization header with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refreshing fails, clear tokens and redirect to login
        console.error('Token refresh failed:', refreshError);

        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        // Redirect to login page
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
