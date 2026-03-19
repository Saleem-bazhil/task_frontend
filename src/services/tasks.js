import api from "../api/Api";

export async function fetchDashboard() {
  const response = await api.get("/api/tasks/dashboard/");
  return response.data;
}

export async function fetchProfileOverview() {
  const [dashboardResponse, tasksResponse] = await Promise.all([
    api.get("/api/tasks/dashboard/"),
    api.get("/api/tasks/"),
  ]);

  return {
    dashboard: dashboardResponse.data,
    tasks: Array.isArray(tasksResponse.data) ? tasksResponse.data : [],
  };
}
