import api from "../api/Api";

export async function fetchUsers() {
  const response = await api.get("/api/chat/users/");
  return response.data;
}

export async function fetchConversations() {
  const response = await api.get("/api/chat/conversations/");
  return response.data;
}

export async function fetchMessages(roomId) {
  const response = await api.get(`/api/chat/rooms/${roomId}/messages/`);
  return response.data;
}

export async function getOrCreateRoom(userId) {
  const response = await api.post("/api/chat/rooms/", { user_id: userId });
  return response.data;
}
