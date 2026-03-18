const fallbackBaseUrl = "http://127.0.0.1:8000";

export const BASE_URL = (import.meta.env.VITE_BASE_URL || fallbackBaseUrl).replace(/\/$/, "");
export const WS_URL = (import.meta.env.VITE_WS_URL || BASE_URL.replace(/^http/, "ws")).replace(/\/$/, "");
