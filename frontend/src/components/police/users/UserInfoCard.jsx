import React from 'react';
import '../../../styles/userDetails.css';

const UserInfoCard = ({ icon: Icon, title, children }) => {
  return (
    <div className="user-info-card">
      <div className="user-info-card-header">
        <div className="user-info-card-icon">
          <Icon size={16} />
        </div>
        <h3 className="user-info-card-title">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default UserInfoCard;


