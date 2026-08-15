import React, { useState } from 'react';
import { Bell, ChevronDown, Menu, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import policeBadge from '../../assets/images/police_badge.png';
import '../../styles/police-header.css';

export const PoliceDashboardHeader = ({ onToggleSidebar }) => {
  const { user, requestLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setDropdownOpen(false);
    if (requestLogout) {
      requestLogout();
    }
  };

  return (
    <header className="police-header">
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
            Police Administrator <span role="img" aria-label="waving hand">👋</span>
          </h1>
          <div className="police-header-subtitle">Command Dashboard</div>
        </div>
      </div>

      <div className="police-header-right">
        {/* Notification Bell Button */}
        <button className="notification-bell-btn" aria-label="View Notifications">
          <Bell size={20} />
          <span className="notification-badge">5</span>
        </button>

        {/* User Profile Badge & Dropdown */}
        <div className="police-user-profile-wrapper">
          <div 
            className={`police-user-profile ${dropdownOpen ? 'open' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="police-avatar-wrapper">
              <img src={policeBadge} alt="Police Administrator" className="police-avatar-img" />
            </div>

            <div className="police-user-info">
              <span className="police-user-name">
                {user?.username || 'Police Administrator'}
              </span>
              <span className="police-user-role">
                {user?.role_name || 'Police Admin'}
              </span>
            </div>

            <ChevronDown size={16} className="police-dropdown-icon" />
          </div>

          {dropdownOpen && (
            <div className="police-profile-dropdown">
              <button className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                <User size={16} />
                <span>Profile</span>
              </button>
              <button className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button className="dropdown-item danger" onClick={handleLogout}>
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
