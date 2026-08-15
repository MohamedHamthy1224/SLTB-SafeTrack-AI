import React, { useState, useEffect, useRef } from 'react';
import { Menu, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getProfileImageUrl } from '../../utils/profileImageUrl';

export const Header = ({ onToggleSidebar, subtitle = "Overview of buses, routes and drivers." }) => {
  const { user, requestLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fullName = user?.sltb_profile?.full_name || user?.fullName || 'Admin User';
  const designation = user?.sltb_profile?.designation || user?.role_name || 'SLTB Admin';
  const profileImage = user?.profile_image || user?.profileImage;
  const avatarUrl = profileImage ? getProfileImageUrl(profileImage, user?.updatedAt) : null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    if (requestLogout) {
      requestLogout();
    }
  };

  return (
    <header className="dashboard-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onToggleSidebar} 
          style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', color: '#1e293b', cursor: 'pointer' }}
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="header-welcome">
          <h2>Welcome back, {fullName}!</h2>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="user-profile-wrapper" ref={dropdownRef}>
          <div 
            className="user-profile-menu" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            role="button"
            tabIndex={0}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User menu"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDropdownOpen(!dropdownOpen);
              }
            }}
          >
            <div className="user-avatar" style={{ overflow: 'hidden', width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #e2e8f0' }}>
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={fullName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div style={{ display: avatarUrl ? 'none' : 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#0240bf', color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                {fullName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="user-details" style={{ display: 'flex', flexDirection: 'column' }}>
              <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{fullName}</h5>
              <p style={{ margin: 0, fontSize: '0.775rem', color: '#64748b' }}>{designation}</p>
            </div>
            <ChevronDown 
              size={16} 
              style={{ 
                color: '#64748b', 
                marginLeft: '0.25rem',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s ease'
              }} 
            />
          </div>

          {dropdownOpen && (
            <div className="sltb-profile-dropdown" role="menu">
              <button 
                className="dropdown-item" 
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/sltb/profile');
                }}
                role="menuitem"
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              <button 
                className="dropdown-item" 
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/sltb/settings');
                }}
                role="menuitem"
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button 
                className="dropdown-item danger" 
                onClick={handleLogout}
                role="menuitem"
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

export default Header;

