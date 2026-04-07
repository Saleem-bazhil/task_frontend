import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import NotificationItem from "./NotificationItem";
import "./NotificationDropdown.css";

const NotificationDropdown = ({ onClose }) => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <div className="notification-dropdown">
      {/* Header */}
      <div className="notification-dropdown-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="notification-dropdown-body">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="notification-dropdown-footer">
          <a href="/notifications" className="view-all-link">
            View all notifications →
          </a>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
