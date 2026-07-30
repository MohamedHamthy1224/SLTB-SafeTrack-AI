import React from 'react';
import StatusBadge from './StatusBadge';
import defaultAvatar from '../../../assets/images/default_driver_avatar.png';
import '../../../styles/userDetails.css';

const getHeaderRoleBadgeClass = (role) => {
  if (role === 'Police Admin') return 'header-role-badge police-admin';
  if (role === 'SLTB Admin') return 'header-role-badge sltb-admin';
  return 'header-role-badge traffic-police';
};

const UserProfileHeader = ({ user }) => {
  return (
    <div className="user-profile-header-card">
      <div className="user-profile-avatar-large">
        <img
          src={user.avatar || defaultAvatar}
          alt={user.fullName}
          onError={(e) => {
            e.currentTarget.src = defaultAvatar;
          }}
        />
      </div>

      <div className="user-profile-header-info">
        <h2 className="user-profile-header-name">{user.fullName}</h2>
        <div className="user-profile-header-badges">
          <span className={getHeaderRoleBadgeClass(user.role)}>
            {user.role}
          </span>
          <StatusBadge status={user.status} />
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
