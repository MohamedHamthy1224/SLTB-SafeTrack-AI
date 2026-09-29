import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bus, 
  RotateCcw, 
  Cpu, 
  Users, 
  Compass, 
  FileBarChart, 
  FileText, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { SystemStatusCard } from './SystemStatusCard';
import { useAuth } from '../../hooks/useAuth';
import sltbLogo from '../../assets/images/sltb_logo.png';
import policeBadge from '../../assets/images/police_badge.png';
import '../../styles/police-sidebar.css';

export const PoliceSidebar = ({ isOpen, onClose }) => {
  const { requestLogout } = useAuth();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    if (requestLogout) {
      requestLogout();
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/police/dashboard' },
    { label: 'Bus Alerts', icon: Bus, path: '/police/bus-alerts' },
    { label: 'U-Turn Alerts', icon: RotateCcw, path: '/police/u-turn-alerts' },
    { label: 'Device Management', icon: Cpu, path: '/police/device-management' },
    { label: 'User Management', icon: Users, path: '/police/user-management' },
    { label: 'U-Turn Management', icon: Compass, path: '/police/u-turn-management' },
    { label: 'AI Analysis Reports', icon: FileBarChart, path: '/police/reports' },
    { label: 'System Logs', icon: FileText, path: '/police/system-logs' },
    { label: 'Settings', icon: Settings, path: '/police/settings' }
  ];

  const isItemActive = (path) => {
    if (path === '/police/dashboard') {
      return location.pathname === '/police/dashboard';
    }
    if (path === '/police/u-turn-management' || path === '/police/uturn-management') {
      return (
        location.pathname.startsWith('/police/u-turn-management') ||
        location.pathname.startsWith('/police/uturn-management')
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div 
        className={`police-sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
        aria-hidden="true"
      />

      <aside className={`police-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="police-sidebar-top">
          {/* Brand Logo Header */}
          <div className="police-sidebar-brand">
            <img src={sltbLogo} alt="SLTB SafeTrack AI" className="police-sidebar-logo-img" />
            <div className="police-sidebar-brand-text">
              <h2>SLTB SafeTrack AI</h2>
              <p>Police Administration</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="police-sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={false}
                  className={({ isActive: _navLinkActive }) => {
                    // Re-evaluated on every route change by React Router v6.
                    // We use our own isItemActive (startsWith-based) for sub-route
                    // support, but receiving _navLinkActive ensures the function
                    // is called on every location update — preventing stale closures.
                    const active = isItemActive(item.path);
                    return `police-nav-item${active ? ' active' : ''}`;
                  }}
                  onClick={onClose}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* System Status Component */}
          <SystemStatusCard />
        </div>

        {/* Sidebar Footer */}
        <div className="police-sidebar-bottom">
          <div className="police-crest-box">
            <img src={policeBadge} alt="Sri Lanka Police" className="police-crest-img" />
            <div className="police-crest-text">
              Sri Lanka Police<br />Traffic Division
            </div>
          </div>

          <button onClick={handleLogout} className="police-logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default PoliceSidebar;
