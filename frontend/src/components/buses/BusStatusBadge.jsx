import React from 'react';

export const BusStatusBadge = ({ status }) => {
  const normalized = status ? status.toLowerCase() : 'active';
  
  return (
    <span className={`bus-status-badge status-${normalized}`}>
      <span className="badge-dot"></span>
      {status || 'Active'}
    </span>
  );
};

export default BusStatusBadge;
