const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Export the API URL in case components need to build file paths
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Endpoints
const API = {
  // Auth
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),

  // Projects
  getProjects: (params = {}) => api.get('/projects', { params }),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (formData) => api.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProject: (id, formData) => api.put(`/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // Services
  getServices: () => api.get('/services'),
  createService: (formData) => api.post('/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateService: (id, formData) => api.put(`/services/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteService: (id) => api.delete(`/services/${id}`),

  // Testimonials
  getTestimonials: () => api.get('/testimonials'),
  createTestimonial: (formData) => api.post('/testimonials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateTestimonial: (id, formData) => api.put(`/testimonials/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),

  // Quotes
  submitQuote: (formData) => api.post('/quotes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getQuotes: () => api.get('/quotes'),
  updateQuoteStatus: (id, status) => api.put(`/quotes/${id}`, { status }),

  // Contact Messages
  submitContact: (data) => api.post('/contact', data),
  getContacts: () => api.get('/contact'),
  updateContactStatus: (id, status) => api.put(`/contact/${id}`, { status }),
};

export default API;
export { api };
