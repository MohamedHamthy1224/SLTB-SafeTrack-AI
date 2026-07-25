import React from 'react';
import { Camera, Calendar, CreditCard } from 'lucide-react';
import { getProfileImageUrl } from '../../utils/profileImageUrl';

export const ProfileSummaryCard = ({ profile }) => {
  if (!profile) return null;

  const fullName = profile.fullName || profile.username || 'Admin User';
  const designation = profile.designation || profile.roleName || 'Administrator';
  const status = profile.status || 'Active';
  const employeeId = profile.employeeId || 'Not Assigned';
  const profileImage = profile.profileImage;
  const updatedAt = profile.updatedAt;

  const avatarUrl = getProfileImageUrl(profileImage, updatedAt);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not Available';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="profile-card profile-summary-card">
      <div className="profile-avatar-wrapper">
        <div className="profile-avatar-circle">
          <img
            src={avatarUrl}
            alt={fullName}
            className="profile-avatar-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="profile-avatar-badge">
          <Camera size={16} />
        </div>
      </div>

      <h3 className="profile-user-name">{fullName}</h3>
      <p className="profile-user-designation">{designation}</p>

      <div className={`profile-status-badge ${status.toLowerCase()}`}>
        <span className="profile-status-dot" />
        <span>{status}</span>
      </div>

      <div className="profile-card-divider" />

      <div className="profile-info-list">
        <div className="profile-info-item">
          <div className="profile-info-icon">
            <CreditCard size={18} />
          </div>
          <div className="profile-info-content">
            <label>Employee ID</label>
            <span>{employeeId}</span>
          </div>
        </div>

        <div className="profile-info-item">
          <div className="profile-info-icon">
            <Calendar size={18} />
          </div>
          <div className="profile-info-content">
            <label>Joined Date</label>
            <span>{formatDate(profile.joinedDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummaryCard;
