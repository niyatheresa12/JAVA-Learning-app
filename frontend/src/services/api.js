import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('javapuff_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('javapuff_token');
        localStorage.removeItem('javapuff_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateAvatar: async (avatar) => {
    const response = await api.put('/auth/avatar', { avatar });
    return response.data;
  },
};

// Learning & Curriculum Service
export const learningService = {
  getLevels: async () => {
    const response = await api.get('/levels');
    return response.data;
  },
  getSublevelQuestions: async (sublevelId) => {
    const response = await api.get(`/sublevels/${sublevelId}/questions`);
    return response.data;
  },
  submitSublevel: async (sublevelId, answers) => {
    const response = await api.post(`/sublevels/${sublevelId}/submit`, { answers });
    return response.data;
  },
};

// Leaderboard / Student Rating Service
export const leaderboardService = {
  getLeaderboard: async () => {
    const response = await api.get('/leaderboard');
    return response.data;
  },
};

// Threat & Menace Service
export const threatService = {
  getThreatStatus: async () => {
    const response = await api.get('/threats/status');
    return response.data;
  },
  begForMercy: async () => {
    const response = await api.post('/threats/beg-for-mercy');
    return response.data;
  },
  refillHearts: async () => {
    const response = await api.post('/user/hearts/refill');
    return response.data;
  },
  decrementHeart: async () => {
    const response = await api.post('/user/hearts/decrement');
    return response.data;
  },
};

export default api;
