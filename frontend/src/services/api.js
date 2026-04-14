import axios from 'axios';

const API_BASE = 'https://all-india-villages-api1.vercel.app';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'x-api-key': 'test123',
    'Content-Type': 'application/json',
  },
});

export const searchVillages = async (query) => {
  const res = await api.get(`/v1/search?q=${query}`);
  return res.data;
};

export default api;