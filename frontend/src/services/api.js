import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Necessary for HttpOnly cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store accessToken in memory
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

// Interceptor to attach access token to requests
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 Unauthorized and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops if /refresh itself fails with 401
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/v1/auth/refresh' &&
      originalRequest.url !== '/v1/auth/login'
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/auth/refresh`,
          {},
          { withCredentials: true } // Required to send the HttpOnly cookie
        );

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);

        // Update the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth state and redirect to login
        setAccessToken(null);
        // You might want to trigger a global event here or use a hook to handle redirect
        window.location.href = '/login'; // Fallback redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/v1/auth/login', { email, password }),
  register: (name, email, password) => api.post('/v1/auth/register', { name, email, password }),
  logout: () => api.post('/v1/auth/logout').then(() => { setAccessToken(null); }),
  getCurrentUser: () => api.get('/v1/auth/me')
};

export default api;
