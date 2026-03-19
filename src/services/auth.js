import api from "../api/Api";
import { clearAuthStorage, setStoredUser, setTokens } from "./storage";

export async function login(credentials) {
  const response = await api.post("/api/auth/login/", credentials);
  setTokens(response.data);
  setStoredUser(response.data.user);
  return response.data.user;
}

export async function register(payload) {
  const response = await api.post("/api/auth/register/", payload);
  setTokens(response.data);
  setStoredUser(response.data.user);
  return response.data.user;
}

export async function fetchCurrentUser() {
  const response = await api.get("/api/auth/me/");
  setStoredUser(response.data);
  return response.data;
}

export async function updateProfile(payload) {
  const response = await api.patch("/api/auth/me/", payload);
  setStoredUser(response.data);
  return response.data;
}

export function logout() {
  clearAuthStorage();
}
