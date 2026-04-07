import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import "./NotificationItem.css";

const NotificationItem = ({ notification, onClose }) => {
  const { markAsRead } = useNotifications();

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    // Navigate to task if available
    if (notification.task_id) {
      onClose();
      window.location.href = `/tasks/${notification.task_id}`;
    }
  };

  const getEventIcon = (eventType) => {
    const icons = {
      task_assigned: "📋",
      task_updated: "✏️",
      comment_added: "💬",
      task_completed: "✅",
      task_status_changed: "⚡",
    };
    return icons[eventType] || "📬";
  };

  const getEventColor = (eventType) => {
    const colors = {
      task_assigned: "#3b82f6",
      task_updated: "#8b5cf6",
      comment_added: "#ec4899",
      task_completed: "#10b981",
      task_status_changed: "#f59e0b",
    };
    return colors[eventType] || "#64748b";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div
      className={`notification-item ${!notification.is_read ? "unread" : "read"}`}
      onClick={handleClick}
      style={{
        "--event-color": getEventColor(notification.event_type),
      }}
    >
      {/* Icon */}
      <div className="notification-icon">
        <span>{getEventIcon(notification.event_type)}</span>
      </div>

      {/* Content */}
      <div className="notification-content">
        <div className="notification-title">
          {notification.sender?.username && (
            <strong>{notification.sender.username}</strong>
          )}
          {notification.title && !notification.sender && (
            <strong>{notification.title}</strong>
          )}
        </div>
        <p className="notification-message">
          {notification.message || notification.action}
        </p>
        {notification.task_title && (
          <p className="notification-task">
            <em>Task: {notification.task_title}</em>
          </p>
        )}
        <div className="notification-meta">
          <span className="notification-time">
            {formatTime(notification.created_at)}
          </span>
          {!notification.is_read && <span className="unread-indicator" />}
        </div>
      </div>

      {/* Action */}
      {notification.task_id && (
        <div className="notification-action">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
