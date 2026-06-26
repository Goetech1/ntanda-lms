import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getTenantId = () => {
  return sessionStorage.getItem('resolvedTenantId') || import.meta.env.VITE_TENANT_ID;
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    const tenantId = getTenantId();
    if (tenantId) {
      config.headers['x-tenant-id'] = tenantId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh' &&
      originalRequest.url !== '/auth/login'
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = response.data.data.access_token;
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        localStorage.removeItem('user');
        window.location.href = '/login';
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
  register: (fullName, email, password) => {
    const [firstName, ...rest] = fullName.split(' ');
    const lastName = rest.join(' ') || '.';
    return api.post('/auth/register', { firstName, lastName, email, password }, {
      headers: { 'x-tenant-id': getTenantId() }
    });
  },
  logout: () => 
    api.post('/auth/logout').then(() => { 
      setAccessToken(null); 
      localStorage.removeItem('user');
    }),
  registerInstitution: (data) => 
    api.post('/auth/register-institution', data)
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
  updateTenantProfile: (data) => api.patch('/tenant', data),
  getAllTenants: () => api.get('/tenants'),
  createTenant: (data) => api.post('/tenants', data),
  updateTenant: (id, data) => api.patch(`/tenants/${id}`, data),
  deleteTenant: (id) => api.delete(`/tenants/${id}`)
};

export const aiService = {
  askTutor: (data) => api.post('/v1/ai/tutor', data),
  generateQuiz: (data) => api.post('/v1/ai/quiz-generator', data),
  getRecommendations: () => api.get('/v1/ai/recommendations')
};

export const assessmentService = {
  getAll: () => api.get('/assessments'),
  create: (data) => api.post('/assessments', data),
  addQuestion: (id, data) => api.post(`/assessments/${id}/questions`, data)
};

export const examService = {
  schedule: (data) => api.post('/v1/exams', data),
  getByCourse: (courseId) => api.get(`/v1/exams/course/${courseId}`)
};

export const studentService = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.patch(`/students/${id}`, data)
};

export const financialService = {
  getPayments: () => api.get('/payments'),
  getSubscriptions: () => api.get('/subscriptions')
};

export const instructorService = {
  getAll: () => api.get('/instructors'),
  create: (data) => api.post('/instructors', data)
};

export const libraryService = {
  getAll: () => api.get('/library'),
  upload: (data) => api.post('/library/upload', data, data instanceof FormData ? {
    headers: { 'Content-Type': 'multipart/form-data' }
  } : undefined)
};

export const communicationService = {
  getAnnouncements: () => api.get('/notifications'),
  sendAnnouncement: (data) => api.post('/notifications', data),
  getPages: () => api.get('/cms')
};

export const certificateService = {
  getAll: () => api.get('/certificates'),
  issue: (data) => api.post('/certificates/issue', data),
  validate: (code) => api.get(`/certificates/validate/${code}`)
};

export const operationsService = {
  batchEnroll: (data) => api.post('/enrollments/batch', data),
  logAttendance: (data) => api.post('/attendance/batch', data),
  logBiometric: (data) => api.post('/attendance/biometric', data)
};

export const studentPortalService = {
  getMyEnrollments: () => api.get('/enrollments/my-enrollments'),
  getCourseCatalog: () => api.get('/courses'),
  getCourseDetails: (id) => api.get(`/courses/${id}`),
  getMyAssessments: (courseId) => api.get(`/assessments/course/${courseId}`),
  getMyCertificates: () => api.get('/certificates/my-certificates')
};

export const instructorPortalService = {
  getOverview: () => api.get('/instructors/my-overview'),
  getMyCourses: () => api.get('/instructors/my-courses'),
  getMyStudents: () => api.get('/instructors/my-students'),
  getMyEarnings: () => api.get('/instructors/my-earnings')
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

export const questionBankService = {
  getCategories: () => api.get('/question-categories'),
  createCategory: (data) => api.post('/question-categories', data),
  deleteCategory: (id) => api.delete(`/question-categories/${id}`),
  getQuestions: (categoryId) => api.get('/questions', { params: { category_id: categoryId } }),
  createQuestion: (data) => api.post('/questions', data),
  updateQuestion: (id, data) => api.patch(`/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/questions/${id}`)
};

export const liveSessionService = {
  getByCourse: (courseId) => api.get('/live-sessions', { params: { course_id: courseId } }),
  create: (data) => api.post('/live-sessions', data),
  update: (id, data) => api.patch(`/live-sessions/${id}`, data),
  delete: (id) => api.delete(`/live-sessions/${id}`)
};

export const analyticsService = {
  getAdminDashboard: () => api.get('/analytics/dashboard'),
  getInstructorDashboard: () => api.get('/analytics/instructor-dashboard'),
  getCourseAnalytics: (courseId) => api.get(`/analytics/course/${courseId}`)
};

export const ltiService = {
  getPlatform: () => api.get('/lti/platform'),
  savePlatform: (data) => api.post('/lti/platform', data),
  generateDeepLink: (data) => api.post('/lti/deep-link/generate', data)
};

export const supportService = {
  getAdminTickets: () => api.get('/support/admin/tickets'),
  getStudentTickets: () => api.get('/support/tickets'),
  getTicket: (id) => api.get(`/support/tickets/${id}`),
  createTicket: (data) => api.post('/support/tickets', data),
  replyTicket: (id, data) => api.post(`/support/tickets/${id}/reply`, data),
  updateStatus: (id, status) => api.patch(`/support/tickets/${id}/status`, { status })
};

export const announcementService = {
  getByCourse: (courseId) => api.get(`/courses/${courseId}/announcements`),
  create: (courseId, data) => api.post(`/courses/${courseId}/announcements`, data)
};

export const studentNoteService = {
  getNote: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}/notes`),
  saveNote: (courseId, lessonId, noteText) => api.post(`/courses/${courseId}/lessons/${lessonId}/notes`, { note_text: noteText })
};

export const bulkImportService = {
  importUsers: (users) => api.post('/admin/users/bulk-import', { users })
};

export const learningPathService = {
  getAll: () => api.get('/learning-paths'),
  getById: (id) => api.get(`/learning-paths/${id}`),
  create: (data) => api.post('/learning-paths', data)
};

export const tenantBrandingService = {
  updateCurrent: (data) => api.put('/tenant/current', data)
};

export const webhookService = {
  getAll: () => api.get('/admin/webhooks'),
  create: (data) => api.post('/admin/webhooks', data),
  update: (id, data) => api.patch(`/admin/webhooks/${id}`, data),
  delete: (id) => api.delete(`/admin/webhooks/${id}`)
};

export const gamificationService = {
  getLeaderboard: () => api.get('/gamification/leaderboard'),
  getBadges: () => api.get('/gamification/badges'),
  createBadge: (data) => api.post('/gamification/badges', data),
  getMyBadges: () => api.get('/gamification/my-badges')
};

export const paymentMethodService = {
  getAll: () => api.get('/payment-methods'),
  create: (data) => api.post('/payment-methods', data),
  update: (id, data) => api.patch(`/payment-methods/${id}`, data),
  delete: (id) => api.delete(`/payment-methods/${id}`)
};

export const studentPaymentService = {
  getAll: () => api.get('/student-payments'),
  getById: (id) => api.get(`/student-payments/${id}`),
  create: (formData) => api.post('/student-payments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  initiateCollection: (data) => api.post('/student-payments/initiate', data),
  review: (id, data) => api.patch(`/student-payments/${id}/review`, data)
};

export const studentAccountService = {
  getAll: () => api.get('/student-account-transactions')
};

export const saasSubscriptionService = {
  getPlans: () => api.get('/subscription-plans'),
  createPlan: (data) => api.post('/subscription-plans', data),
  updatePlan: (id, data) => api.patch(`/subscription-plans/${id}`, data),
  
  getCurrentSubscription: () => api.get('/institution-subscriptions'),
  initiatePayment: (data) => api.post('/institution-subscriptions/initiate', data)
};

export default api;
