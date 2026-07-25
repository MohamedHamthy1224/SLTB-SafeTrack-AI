import React from 'react';

export const RouteStatusBadge = ({ status }) => {
  const isInactive = status === 'Inactive';
  
  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.65rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    letterSpacing: '0.02em',
    backgroundColor: isInactive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
    color: isInactive ? '#ef4444' : '#22c55e',
    border: `1px solid ${isInactive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`
  };

  return (
    <span style={badgeStyle} className="route-status-badge">
      {status || 'Active'}
    </span>
  );
};

export default RouteStatusBadge;
