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

// Helper for tenant resolution (dynamic or env fallback)
export const getTenantId = () => {
  // In a real production environment with subdomains, you might resolve the UUID
  // via an initial API call or inject it. For now, we fallback to the env variable.
  return import.meta.env.VITE_TENANT_ID;
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
      originalRequest.url !== '/auth/refresh' &&
      originalRequest.url !== '/auth/login'
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true } // Required to send the HttpOnly cookie
        );

        // The API contract dictates the token is inside data.data.access_token
        const newAccessToken = response.data.data.access_token;
        setAccessToken(newAccessToken);

        // Update the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth state and redirect to login
        setAccessToken(null);
        localStorage.removeItem('user');
        window.location.href = '/login'; // Fallback redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }, {
      headers: { 'x-tenant-id': getTenantId() }
    }),
    
  register: (fullName, email, password) => 
    api.post('/auth/register', { fullName, email, password }, {
      headers: { 'x-tenant-id': getTenantId() }
    }),
    
  logout: () => 
    api.post('/auth/logout').then(() => { 
      setAccessToken(null); 
      localStorage.removeItem('user');
    })
};

export const courseService = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.patch(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`)
};

export const enrollmentService = {
  getMyEnrollments: () => api.get('/enrollments/my-enrollments'),
  // Admin manual enrollment (temporarily used for testing without Stripe)
  manualEnroll: (userId, courseId) => api.post('/enrollments', { userId, courseId })
};

export const paymentService = {
  createStripeCheckout: (courseId, amount) => api.post('/payments/stripe/checkout', { courseId, amount })
};

export const userService = {
  getAllUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

export const tenantService = {
  getTenantProfile: () => api.get('/tenant'),
  updateTenantProfile: (data) => api.patch('/tenant', data)
};

export const virtualClassroomService = {
  getAll: () => api.get('/virtual-classrooms'),
  schedule: (data) => api.post('/virtual-classrooms/schedule', data),
  register: (id, data) => api.post(`/virtual-classrooms/${id}/register`, data)
};

export const roleService = {
  getAll: () => api.get('/roles'),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.patch(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`),
  assignPermissions: (id, data) => api.post(`/roles/${id}/permissions`, data)
};

export const permissionService = {
  getAll: () => api.get('/permissions')
};

export const institutionService = {
  getCurrent: () => api.get('/institutions/current'),
  updateCurrent: (data) => api.patch('/institutions/current', data)
};

export const departmentService = {
  getAll: () => api.get('/departments'),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.patch(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`)
};

export const sessionService = {
  getAll: () => api.get('/academic-sessions'),
  create: (data) => api.post('/academic-sessions', data),
  activate: (id) => api.patch(`/academic-sessions/${id}/activate`),
  delete: (id) => api.delete(`/academic-sessions/${id}`)
};

export const categoryService = {
  getAll: () => api.get('/course-categories'),
  create: (data) => api.post('/course-categories', data),
  update: (id, data) => api.patch(`/course-categories/${id}`, data),
  delete: (id) => api.delete(`/course-categories/${id}`)
};

export const courseModuleService = {
  getModulesByCourse: (courseId) => api.get(`/course-modules/by-course/${courseId}`),
  createModule: (data) => api.post('/course-modules', data)
};

export const lessonService = {
  createLesson: (data) => api.post('/lessons', data)
};

export default api;
