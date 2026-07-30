import React from 'react';
import { Mail, User, Shield, Calendar, Clock } from 'lucide-react';
import defaultAvatar from '../../../assets/images/default_driver_avatar.png';
import '../../../styles/settings.css';

/**
 * ProfileViewCard — left card in the View Profile page.
 * Shows avatar, name, role badge, department, and info rows.
 */
const ProfileViewCard = ({ profile }) => {
  const infoRows = [
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: User, label: 'Username', value: profile.username },
    { icon: Shield, label: 'Role', value: profile.role },
    { icon: Calendar, label: 'Joined Date', value: profile.joinedDate },
    { icon: Clock, label: 'Status', isStatus: true, value: profile.status },
  ];

  return (
    <div className="settings-profile-left-card">
      {/* Avatar */}
      <div className="settings-profile-avatar-wrap">
        <img
          src={defaultAvatar}
          alt={profile.displayName}
          className="settings-profile-avatar-img"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextSibling.style.display = 'flex';
          }}
        />
        <div className="settings-profile-avatar-initials" style={{ display: 'none' }}>
          {profile.displayName?.charAt(0) ?? 'P'}
        </div>
      </div>

      {/* Name & Badge */}
      <p className="settings-profile-name">{profile.displayName}</p>
      <span className="settings-role-badge">{profile.roleDisplay}</span>
      <p className="settings-profile-dept">{profile.department}</p>

      {/* Info List */}
      <div className="settings-left-info-list">
        {infoRows.map(({ icon: Icon, label, value, isStatus }) => (
          <div className="settings-left-info-item" key={label}>
            <div className="settings-left-info-icon">
              <Icon size={14} />
            </div>
            <div className="settings-left-info-content">
              <span className="settings-left-info-label">{label}</span>
              {isStatus ? (
                <span className="badge-active">{value}</span>
              ) : (
                <span className="settings-left-info-value">{value}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileViewCard;
