import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const API_KEY = import.meta.env.VITE_API_KEY || 'test123';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ✅ Updated: include '/v1' prefix
export const searchVillages = async (query, limit = 20) => {
  try {
    const response = await api.get(`/v1/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Search villages error:', error);
    throw error;
  }
};

export const autocomplete = async (query, limit = 10) => {
  try {
    const response = await api.get(`/v1/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Autocomplete error:', error);
    return { data: [] };
  }
};

export const fetchStates = async () => {
  try {
    const response = await api.get('/v1/states');
    return response.data;
  } catch (error) {
    console.error('Fetch states error:', error);
    throw error;
  }
};

export const fetchDistrictsByState = async (stateId) => {
  try {
    const response = await api.get(`/v1/states/${stateId}/districts`);
    return response.data;
  } catch (error) {
    console.error('Fetch districts error:', error);
    throw error;
  }
};

export const fetchSubDistrictsByDistrict = async (districtId) => {
  try {
    const response = await api.get(`/v1/districts/${districtId}/subdistricts`);
    return response.data;
  } catch (error) {
    console.error('Fetch sub-districts error:', error);
    throw error;
  }
};

export const fetchVillagesBySubDistrict = async (subDistrictId, page = 1, limit = 20) => {
  try {
    const response = await api.get(`/v1/subdistricts/${subDistrictId}/villages?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Fetch villages error:', error);
    throw error;
  }
};

export default api;