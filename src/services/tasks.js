import api from "../api/Api";

export async function fetchDashboard() {
  const response = await api.get("/api/tasks/dashboard/");
  return response.data;
}
