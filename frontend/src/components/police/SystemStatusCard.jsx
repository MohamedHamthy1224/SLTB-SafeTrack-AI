import React from 'react';
import '../../styles/police-sidebar.css';

export const SystemStatusCard = () => {
  return (
    <div className="system-status-card">
      <div className="system-status-header">
        <span className="status-dot"></span>
        <span className="system-status-title">System Status</span>
      </div>
      <div className="system-status-text">All Systems Operational</div>
      <div className="system-status-meta">
        Last Updated
        <div className="system-status-time">07 Jun 2025, 10:30 AM</div>
      </div>
    </div>
  );
};

export default SystemStatusCard;
