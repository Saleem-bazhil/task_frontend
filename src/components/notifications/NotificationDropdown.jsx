import React from "react";
import { Bell, ChevronRight } from "lucide-react";
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
      <div className="notification-dropdown-header">
        <div>
          <span className="notification-eyebrow">Activity Center</span>
          <h3>Notifications</h3>
        </div>
        {unreadCount > 0 && (
          <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notification-dropdown-body">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Bell size={30} strokeWidth={2.3} />
            </div>
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

      {notifications.length > 0 && (
        <div className="notification-dropdown-footer">
          <a href="/notifications" className="view-all-link">
            View all notifications
            <ChevronRight size={16} strokeWidth={2.4} />
          </a>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
