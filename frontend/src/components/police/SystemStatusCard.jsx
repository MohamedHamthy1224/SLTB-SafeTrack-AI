import React from 'react';
import '../../styles/police-sidebar.css';

export const SystemStatusCard = ({ status, lastUpdated }) => {
  const statusText = status?.statusText || status || 'All Systems Operational';
  const updatedTime = lastUpdated || status?.lastUpdated || new Date().toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const isOperational = status?.isOperational !== false;

  return (
    <div className="system-status-card">
      <div className="system-status-header">
        <span 
          className="status-dot" 
          style={{ backgroundColor: isOperational ? '#10B981' : '#F59E0B' }}
        />
        <span className="system-status-title">System Status</span>
      </div>
      <div className="system-status-text">{statusText}</div>
      <div className="system-status-meta">
        Last Updated
        <div className="system-status-time">{updatedTime}</div>
      </div>
    </div>
  );
};

export default SystemStatusCard;
