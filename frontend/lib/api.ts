import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  'http://localhost:3001';

const api = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
