import React from 'react';
import StatusBadge from './StatusBadge';
import '../../../styles/userDetails.css';

const InformationRow = ({ label, value, isStatus, isMasked }) => {
  return (
    <div className="details-row">
      <span className="details-label">{label}</span>
      <span className="details-value">
        {isStatus ? (
          <StatusBadge status={value} />
        ) : isMasked ? (
          '••••••••'
        ) : (
          value || '—'
        )}
      </span>
    </div>
  );
};

export default InformationRow;
