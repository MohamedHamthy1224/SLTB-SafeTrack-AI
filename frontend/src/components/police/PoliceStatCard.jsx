import React from 'react';
import '../../styles/police-cards.css';

export const PoliceStatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => {
  return (
    <div className="police-stat-card">
      <div 
        className="stat-icon-badge" 
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        <Icon size={24} />
      </div>

      <div className="stat-info-content">
        <h4 className="stat-info-title">{title}</h4>
        <span className="stat-info-value">{value}</span>
      </div>
    </div>
  );
};

export default PoliceStatCard;
