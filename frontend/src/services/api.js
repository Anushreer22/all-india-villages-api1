import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://all-india-villages-api1-kesi.vercel.app";

const API_KEY = import.meta.env.VITE_API_KEY || "test123";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.message);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// search villages
export const searchVillages = async (query, limit = 20) => {
  const response = await api.get(
    `/v1/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  return response.data;
};

// fetch states
export const fetchStates = async () => {
  const response = await api.get("/v1/states");
  return response.data;
};

// fetch districts by state
export const fetchDistrictsByState = async (stateId) => {
  const response = await api.get(`/v1/states/${stateId}/districts`);
  return response.data;
};

// fetch subdistricts
export const fetchSubDistrictsByDistrict = async (districtId) => {
  const response = await api.get(
    `/v1/districts/${districtId}/subdistricts`
  );
  return response.data;
};

// fetch villages
export const fetchVillagesBySubDistrict = async (
  subDistrictId,
  page = 1,
  limit = 20
) => {
  const response = await api.get(
    `/v1/subdistricts/${subDistrictId}/villages?page=${page}&limit=${limit}`
  );
  return response.data;
};

export default api;