import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  MessageSquare,
  Pencil,
  Zap,
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import "./NotificationItem.css";

const EVENT_META = {
  task_assigned: {
    Icon: ClipboardList,
    color: "#e11d48",
    soft: "#fff1f2",
    border: "#fecdd3",
    label: "Assigned",
  },
  task_updated: {
    Icon: Pencil,
    color: "#4f46e5",
    soft: "#eef2ff",
    border: "#c7d2fe",
    label: "Updated",
  },
  comment_added: {
    Icon: MessageSquare,
    color: "#ec4899",
    soft: "#fdf2f8",
    border: "#fbcfe8",
    label: "Comment",
  },
  task_completed: {
    Icon: CheckCircle2,
    color: "#10b981",
    soft: "#ecfdf5",
    border: "#a7f3d0",
    label: "Completed",
  },
  task_status_changed: {
    Icon: Zap,
    color: "#f59e0b",
    soft: "#fffbeb",
    border: "#fde68a",
    label: "Status",
  },
};

const FALLBACK_META = {
  Icon: ClipboardList,
  color: "#64748b",
  soft: "#f8fafc",
  border: "#e2e8f0",
  label: "Notice",
};

const NotificationItem = ({ notification, onClose }) => {
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();
  const meta = EVENT_META[notification.event_type] || FALLBACK_META;
  const Icon = meta.Icon;

  const resolveTaskRoute = () => {
    const status = (notification.task_status || notification.status || "").toLowerCase();
    const eventType = notification.event_type || "";

    if (status === "completed" || eventType === "task_completed") {
      return "/app/completed-tasks";
    }

    if (
      status === "in_progress" ||
      eventType === "task_status_changed" ||
      eventType === "comment_added"
    ) {
      return "/app/accepted-tasks";
    }

    return "/app/my-tasks";
  };

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    if (notification.task_id) {
      onClose();
      navigate(resolveTaskRoute());
    }
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
        "--event-color": meta.color,
        "--event-soft": meta.soft,
        "--event-border": meta.border,
      }}
    >
      <div className="notification-icon">
        <Icon size={20} strokeWidth={2.4} />
      </div>

      <div className="notification-content">
        <div className="notification-title-row">
          <div className="notification-title">
            {notification.sender?.username && (
              <strong>{notification.sender.username}</strong>
            )}
            {notification.title && !notification.sender && (
              <strong>{notification.title}</strong>
            )}
            {!notification.sender?.username && !notification.title && (
              <strong>{meta.label} update</strong>
            )}
          </div>
          <span className="notification-event-label">{meta.label}</span>
        </div>
        <p className="notification-message">
          {notification.message || notification.action}
        </p>
        {notification.task_title && (
          <p className="notification-task">Task: {notification.task_title}</p>
        )}
        <div className="notification-meta">
          <span className="notification-time">
            {formatTime(notification.created_at)}
          </span>
          {!notification.is_read && <span className="unread-indicator" />}
        </div>
      </div>

      {notification.task_id && (
        <div className="notification-action">
          <ChevronRight size={18} strokeWidth={2.4} />
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
