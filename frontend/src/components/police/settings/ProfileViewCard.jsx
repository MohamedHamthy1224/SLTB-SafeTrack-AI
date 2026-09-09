import React from 'react';
import { Mail, User, Shield, Calendar, Clock } from 'lucide-react';
import defaultAvatar from '../../../assets/images/default_driver_avatar.png';
import { getProfileImageUrl } from '../../../utils/profileImageUrl';
import '../../../styles/settings.css';

/**
 * ProfileViewCard — left card in the View Profile page.
 * Shows avatar, name, role badge, department, and info rows.
 */
const ProfileViewCard = ({ profile = {} }) => {
  const avatarUrl = getProfileImageUrl(
    profile.profileImage || profile.profile_image || profile.avatar,
    profile.updatedAt || profile.updated_at
  );

  const displayName = profile.displayName || profile.fullName || profile.full_name || profile.username || 'User';
  const roleDisplay = profile.roleDisplay || profile.roleName || profile.role || 'User';

  const infoRows = [
    { icon: Mail, label: 'Email', value: profile.email || profile.emailAddress || '—' },
    { icon: User, label: 'Username', value: profile.username || '—' },
    { icon: Shield, label: 'Role', value: profile.role || profile.roleName || '—' },
    { icon: Calendar, label: 'Joined Date', value: profile.joinedDate || profile.joined_date || '—' },
    { icon: Clock, label: 'Status', isStatus: true, value: profile.status || 'Active' },
  ];

  return (
    <div className="settings-profile-left-card">
      {/* Avatar */}
      <div className="settings-profile-avatar-wrap">
        <img
          src={avatarUrl}
          alt={displayName}
          className="settings-profile-avatar-img"
          onError={(e) => {
            e.currentTarget.src = defaultAvatar;
          }}
        />
      </div>

      {/* Name & Badge */}
      <p className="settings-profile-name">{displayName}</p>
      <span className="settings-role-badge">{roleDisplay}</span>
      <p className="settings-profile-dept">{profile.department || '—'}</p>

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
