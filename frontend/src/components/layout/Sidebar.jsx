import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bus, 
  UserCheck, 
  GitFork, 
  FileBarChart, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import logoImg from '../../assets/images/sltb_logo.png';
import busBgImg from '../../assets/images/sltb_bus_bg.jpg';

export const Sidebar = ({ isOpen, onClose }) => {
  const { requestLogout } = useAuth();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    requestLogout();
  };

  const isBusManagementActive = location.pathname.startsWith('/sltb/buses');
  const isDriverManagementActive = location.pathname.startsWith('/sltb/drivers');
  const isRouteManagementActive = location.pathname.startsWith('/sltb/routes');
  const isProfileActive = location.pathname.startsWith('/sltb/profile');

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      <div>
        <div className="sidebar-header">
          <img src={logoImg} alt="SLTB SafeTrack AI" className="sidebar-logo" />
          <div className="sidebar-brand-text">
            <h2>SLTB</h2>
            <p>Sri Lanka Transport Board</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/sltb/dashboard" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            <span>Home Dashboard</span>
          </NavLink>

          <NavLink 
            to="/sltb/buses" 
            className={`nav-item ${isBusManagementActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Bus size={18} />
            <span>Bus Management</span>
          </NavLink>

          <NavLink 
            to="/sltb/drivers" 
            className={`nav-item ${isDriverManagementActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <UserCheck size={18} />
            <span>Driver Management</span>
          </NavLink>

          <NavLink 
            to="/sltb/routes" 
            className={`nav-item ${isRouteManagementActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <GitFork size={18} />
            <span>Route Management</span>
          </NavLink>

          {/* Reports item directly below Route Management & above Profile */}
          <NavLink 
            to="/sltb/reports" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FileBarChart size={18} />
            <span>Reports</span>
          </NavLink>

          <NavLink 
            to="/sltb/profile" 
            className={`nav-item ${isProfileActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <User size={18} />
            <span>Profile</span>
          </NavLink>

          <NavLink 
            to="/sltb/settings" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>

          <a href="#logout" onClick={handleLogout} className="nav-item" style={{ marginTop: '1rem', color: '#f87171' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </a>
        </nav>
      </div>

      <div className="sidebar-footer-card">
        <img src={busBgImg} alt="Safe Journeys" className="sidebar-bus-thumb" />
        <h5>Safe Journeys</h5>
        <p>Better Tomorrow</p>
        <p style={{ fontSize: '0.675rem', opacity: 0.8, marginTop: '0.2rem' }}>
          Efficient management for a smarter Sri Lanka.
        </p>
      </div>
    </aside>
  );
};
