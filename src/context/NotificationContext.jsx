import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./useAuth";
import { BASE_URL, WS_URL } from "../config/env";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelayRef = useRef(1000); // Start with 1s

  // Get the WebSocket URL for notifications using backend env and current JWT token
  const getWsUrl = () => {
    if (!token) return null;
    return `${WS_URL}/ws/notifications/?token=${encodeURIComponent(token)}`;
  };

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    if (!token) {
      setIsConnected(false);
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const wsUrl = getWsUrl();
      if (!wsUrl) {
        setIsConnected(false);
        return;
      }
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("🔔 Notification WebSocket connected");
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        reconnectDelayRef.current = 1000; // Reset delay

        // Fetch initial unread count when connected
        fetchUnreadCount();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "notification") {
            const notification = message.data;
            console.log("📬 New notification:", notification);

            // Add to notifications
            setNotifications((prev) => [notification, ...prev]);

            // Update unread count
            if (!notification.is_read) {
              setUnreadCount((prev) => prev + 1);
            }
          }
        } catch (err) {
          console.error("Error processing WebSocket message:", err);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        setIsConnected(false);
      };

      wsRef.current.onclose = () => {
        console.log("❌ Notification WebSocket disconnected");
        setIsConnected(false);

        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay =
            reconnectDelayRef.current *
            Math.pow(2, reconnectAttemptsRef.current - 1);
          reconnectDelayRef.current = delay;

          console.log(
            `🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        } else {
          console.error("Failed to reconnect after maximum attempts");
        }
      };
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      setIsConnected(false);
    }
  }, [token, user]);

  // Fetch unread count from API
  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/notifications/unread_count/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, [token]);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/api/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.results || data);

        // Count unread
        const unread = (data.results || data).filter((n) => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [token]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId) => {
      if (!token) return;

      try {
        const response = await fetch(
          `${BASE_URL}/api/notifications/${notificationId}/mark_as_read/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          // Update local state
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId ? { ...n, is_read: true } : n,
            ),
          );

          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [token],
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/notifications/mark_all_read/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        // Update all notifications
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, [token]);

  // Initial connection and cleanup
  useEffect(() => {
    if (token && user) {
      connectWebSocket();
      fetchNotifications();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [token, user, connectWebSocket, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};
