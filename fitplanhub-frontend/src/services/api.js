import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Plans APIs
export const plansAPI = {
  getAll: () => api.get('/plans'),
  getById: (id) => api.get(`/plans/${id}`),
  create: (planData) => api.post('/plans', planData),
  update: (id, planData) => api.put(`/plans/${id}`, planData),
  delete: (id) => api.delete(`/plans/${id}`),
};

// Subscriptions APIs
export const subscriptionsAPI = {
  subscribe: (planId) => api.post(`/subscriptions/${planId}`),
  getMy: () => api.get('/subscriptions'),
  check: (planId) => api.get(`/subscriptions/check/${planId}`),
};

// Follows APIs
export const followsAPI = {
  follow: (trainerId) => api.post(`/follows/${trainerId}`),
  unfollow: (trainerId) => api.delete(`/follows/${trainerId}`),
  getMy: () => api.get('/follows'),
  check: (trainerId) => api.get(`/follows/check/${trainerId}`),
  getFeed: () => api.get('/follows/feed/personalized'),
};

export default api;