import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Menu, User, Settings, LogOut, AlertTriangle } from 'lucide-react';
import io from 'socket.io-client';
import { useAuth } from '../../hooks/useAuth';
import notificationService from '../../services/notificationService';
import policeBadge from '../../assets/images/police_badge.png';
import '../../styles/police-header.css';

const PRIORITY_COLORS = {
  High: { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
  Medium: { bg: '#fff7ed', text: '#ea580c', dot: '#f97316' },
  Low: { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' }
};

const MAX_NOTIFICATIONS = 10;
const BACKEND_SOCKET_URL =
  typeof window !== 'undefined'
    ? window.__VITE_SOCKET_URL__ || 'http://localhost:5001'
    : 'http://localhost:5001';

export const PoliceDashboardHeader = ({ onToggleSidebar }) => {
  const { user, requestLogout } = useAuth();
  const navigate = useNavigate();

  // ── Profile dropdown state ─────────────────────────────────────────
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // ── Notification bell state ────────────────────────────────────────
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const bellDropdownRef = useRef(null);

  // ── Socket ref ────────────────────────────────────────────────────
  const socketRef = useRef(null);

  // ── Derive profile values from auth context ────────────────────────
  const fullName = user?.full_name || user?.fullName || user?.username || 'Police Administrator';
  const roleName = user?.role_name || user?.role || 'Police Admin';
  const profileImage = user?.profile_image || user?.avatar || null;

  // ── Format relative time ──────────────────────────────────────────
  const formatTime = (createdAt) => {
    if (!createdAt) return 'Just now';
    const date = new Date(createdAt.replace(' ', 'T'));
    if (isNaN(date.getTime())) return createdAt;
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  // ── Fetch initial notifications from backend ───────────────────────
  const fetchInitialNotifications = useCallback(async () => {
    try {
      const res = await notificationService.getMyNotifications(MAX_NOTIFICATIONS);
      if (res && Array.isArray(res.data)) {
        setNotifications(res.data);
        setNotificationCount(res.data.length);
      } else if (res && res.data && Array.isArray(res.data)) {
        setNotifications(res.data);
        setNotificationCount(res.data.length);
      }
    } catch {
      // Silently ignore — auth may not be ready yet or user is not a police officer
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchInitialNotifications();
    }
  }, [user, fetchInitialNotifications]);

  // ── Socket.IO real-time subscription ──────────────────────────────
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_police_admin');
    });

    socket.on('new_notification', (payload) => {
      if (!payload || !payload.notification_id) return;

      const newNotif = {
        notification_id: payload.notification_id,
        title: payload.title || 'New Alert',
        message: payload.message || '',
        priority: payload.priority || 'Medium',
        created_at: payload.created_at || new Date().toISOString()
      };

      setNotifications((prev) => {
        // Deduplicate by notification_id
        const exists = prev.some(
          (n) => n.notification_id === newNotif.notification_id
        );
        if (exists) return prev;
        return [newNotif, ...prev].slice(0, MAX_NOTIFICATIONS);
      });

      setNotificationCount((prev) => prev + 1);
    });

    return () => {
      socket.off('new_notification');
      socket.disconnect();
    };
  }, []);

  // ── Click outside to close dropdowns ──────────────────────────────
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        bellDropdownRef.current &&
        !bellDropdownRef.current.contains(e.target)
      ) {
        setBellOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleBellClick = () => {
    setBellOpen((prev) => !prev);
    setProfileDropdownOpen(false);
    if (!bellOpen) {
      // Mark as read when opening
      setNotificationCount(0);
    }
  };

  const handleProfileDropdownToggle = () => {
    setProfileDropdownOpen((prev) => !prev);
    setBellOpen(false);
  };

  const handleNavigateProfile = () => {
    setProfileDropdownOpen(false);
    navigate('/police/profile');
  };

  const handleNavigateSettings = () => {
    setProfileDropdownOpen(false);
    navigate('/police/settings');
  };

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    if (requestLogout) {
      requestLogout();
    }
  };

  // ── Avatar rendering ──────────────────────────────────────────────
  const renderAvatar = () => {
    if (profileImage) {
      // Handle both relative paths and full URLs
      const imgSrc = profileImage.startsWith('http')
        ? profileImage
        : `/api/v1/uploads/profiles/${profileImage.replace(/^.*[\\/]/, '')}`;
      return (
        <img
          src={imgSrc}
          alt={fullName}
          className="police-avatar-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = policeBadge;
          }}
        />
      );
    }
    return (
      <img src={policeBadge} alt="Police Administrator" className="police-avatar-img" />
    );
  };

  return (
    <header className="police-header">
      {/* ── Left: Menu toggle + title ─────────────────────────────────── */}
      <div className="police-header-left">
        <button
          className="mobile-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="police-header-welcome">Welcome back,</p>
          <h1 className="police-header-title">
            {fullName} <span role="img" aria-label="waving hand">👋</span>
          </h1>
          <div className="police-header-subtitle">Command Dashboard</div>
        </div>
      </div>

      {/* ── Right: Bell + Profile ──────────────────────────────────────── */}
      <div className="police-header-right">

        {/* Notification Bell */}
        <div className="notif-bell-wrapper" ref={bellDropdownRef}>
          <button
            id="police-notif-bell-btn"
            className="notification-bell-btn"
            aria-label="View Notifications"
            onClick={handleBellClick}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="notification-badge">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {bellOpen && (
            <div className="notif-dropdown" id="police-notif-dropdown">
              <div className="notif-dropdown-header">
                <span className="notif-dropdown-title">Notifications</span>
                <span className="notif-dropdown-count">
                  {notifications.length} recent
                </span>
              </div>

              <div className="notif-dropdown-list">
                {notifications.length === 0 ? (
                  <div className="notif-dropdown-empty">
                    <Bell size={22} color="#94a3b8" />
                    <p>No notifications yet</p>
                    <span>Sensor alerts will appear here in real time.</span>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const colors = PRIORITY_COLORS[notif.priority] || PRIORITY_COLORS.Medium;
                    return (
                      <div
                        key={notif.notification_id}
                        className="notif-dropdown-item"
                      >
                        <div className="notif-item-header">
                          <span className="notif-item-title">{notif.title}</span>
                          <span
                            className="notif-priority-badge"
                            style={{
                              background: colors.bg,
                              color: colors.text
                            }}
                          >
                            <span
                              className="notif-priority-dot"
                              style={{ background: colors.dot }}
                            />
                            {notif.priority}
                          </span>
                        </div>
                        <p className="notif-item-message">{notif.message}</p>
                        <span className="notif-item-time">
                          {formatTime(notif.created_at)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {notifications.length > 0 && (
                <div className="notif-dropdown-footer">
                  <button
                    className="notif-view-all-btn"
                    onClick={() => {
                      setBellOpen(false);
                      navigate('/police/u-turn-alerts');
                    }}
                  >
                    View All Alerts
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Badge & Dropdown */}
        <div className="police-user-profile-wrapper" ref={profileDropdownRef}>
          <div
            id="police-profile-trigger"
            className={`police-user-profile ${profileDropdownOpen ? 'open' : ''}`}
            onClick={handleProfileDropdownToggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleProfileDropdownToggle()}
          >
            <div className="police-avatar-wrapper">
              {renderAvatar()}
            </div>

            <div className="police-user-info">
              <span className="police-user-name">{fullName}</span>
              <span className="police-user-role">{roleName}</span>
            </div>

            <ChevronDown size={16} className="police-dropdown-icon" />
          </div>

          {profileDropdownOpen && (
            <div className="police-profile-dropdown" id="police-profile-dropdown">
              <button
                id="police-nav-profile"
                className="dropdown-item"
                onClick={handleNavigateProfile}
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              <button
                id="police-nav-settings"
                className="dropdown-item"
                onClick={handleNavigateSettings}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <div className="dropdown-divider" />
              <button
                id="police-nav-logout"
                className="dropdown-item danger"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PoliceDashboardHeader;
