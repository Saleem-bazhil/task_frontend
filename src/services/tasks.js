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

export async function postComment(taskId, content) {
  const response = await api.post("/api/comments/", { task: taskId, content });
  return response.data;
}

export async function uploadAttachment(taskId, file) {
  const formData = new FormData();
  formData.append("task", taskId);
  formData.append("file", file);
  
  const response = await api.post("/api/attachments/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}