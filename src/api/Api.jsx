import axios from "axios";

import { BASE_URL } from "../config/env";
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../services/storage";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refresh = getRefreshToken();
    if (!refresh) {
      clearAuthStorage();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = axios
        .post(`${BASE_URL}/api/auth/refresh/`, { refresh })
        .then((response) => {
          setTokens({
            access: response.data.access,
            refresh,
          });
          return response.data.access;
        })
        .catch((refreshError) => {
          clearAuthStorage();
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const access = await refreshPromise;
    originalRequest.headers.Authorization = `Bearer ${access}`;
    return api(originalRequest);
  },
);

export default api;
