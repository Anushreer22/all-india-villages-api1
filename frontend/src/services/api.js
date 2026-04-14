import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  'https://all-india-villages-api1.vercel.app';

const API_KEY =
  import.meta.env.VITE_API_KEY ||
  'test123';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export const searchVillages = async (query, limit = 20) => {
  const response = await api.get(
    `/v1/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  return response.data;
};

export const fetchStates = async () => {
  const response = await api.get('/v1/states');
  return response.data;
};

export default api;