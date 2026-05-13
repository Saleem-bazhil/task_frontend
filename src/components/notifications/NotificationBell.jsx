import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";
import "./NotificationBell.css";

const NotificationBell = () => {
  const { unreadCount, isConnected } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="notification-container">
      {/* Bell Icon Button */}
      <button
        className={`notification-bell ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title={`Notifications (${unreadCount} unread) - ${isConnected ? "Connected" : "Disconnected"}`}
      >
        <Bell className="bell-icon" strokeWidth={2.4} />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <span
          className={`connection-indicator ${isConnected ? "connected" : "disconnected"}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default NotificationBell;
