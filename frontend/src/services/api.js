import axios from 'axios';

const API_URL = 'https://aivora-backend-l8mv.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Chat endpoints
export const sendMessage = (message, uniContext = null) =>
  api.post('/chat', { message, uniContext });
export const resetChat = () => api.delete('/chat/reset');

// History endpoints (требуют JWT)
export const getHistory = () => api.get('/history');
export const saveSession = (data) => api.post('/history/save', data);
export const deleteSession = (id) => api.delete(`/history/${id}`);

export default api;