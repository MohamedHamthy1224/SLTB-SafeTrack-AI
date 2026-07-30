import React from 'react';
import '../../../styles/userDetails.css';

const StatusBadge = ({ status, isOnline }) => {
  const label = status || (isOnline ? 'Online' : 'Offline');
  const isGreen =
    label?.toLowerCase() === 'active' || label?.toLowerCase() === 'online';

  return (
    <span className={`status-badge-dot ${isGreen ? 'active' : 'inactive'}`}>
      <span className={`dot-indicator ${isGreen ? 'green' : 'gray'}`} />
      {label}
    </span>
  );
};

export default StatusBadge;
