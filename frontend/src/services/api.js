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

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const sendMessage = (message) => api.post('/chat', { message });
export const resetChat = () => api.delete('/chat/reset');

export default api;