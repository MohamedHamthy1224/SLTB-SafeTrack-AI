import React from 'react';
import { User, Shield, CheckCircle, Calendar, Building2 } from 'lucide-react';
import UserInfoCard from './UserInfoCard';
import InformationRow from './InformationRow';
import StatusBadge from './StatusBadge';
import defaultAvatar from '../../../assets/images/default_driver_avatar.png';
import '../../../styles/userDetails.css';

const SLTBAdminDetails = ({ user }) => {
  const userIdDisplay = user.userId || `USR-000${user.id}`;
  const sltbUserIdDisplay = user.sltbUserId || `SLTB-0002${user.id}`;

  return (
    <>
      {/* Top 4 Summary Cards Grid */}
      <div className="sltb-summary-grid">
        <div className="sltb-summary-card">
          <div className="sltb-summary-icon-wrap" style={{ background: '#eff6ff', color: '#0047ff' }}>
            <User size={18} />
          </div>
          <div className="sltb-summary-content">
            <span className="sltb-summary-label">User ID</span>
            <span className="sltb-summary-value">{userIdDisplay}</span>
          </div>
        </div>

        <div className="sltb-summary-card">
          <div className="sltb-summary-icon-wrap" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
            <Shield size={18} />
          </div>
          <div className="sltb-summary-content">
            <span className="sltb-summary-label">Role</span>
            <span className="sltb-summary-value">{user.role}</span>
          </div>
        </div>

        <div className="sltb-summary-card">
          <div className="sltb-summary-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <CheckCircle size={18} />
          </div>
          <div className="sltb-summary-content">
            <span className="sltb-summary-label">Status</span>
            <span className="sltb-summary-value">
              <StatusBadge status={user.status} />
            </span>
          </div>
        </div>

        <div className="sltb-summary-card">
          <div className="sltb-summary-icon-wrap" style={{ background: '#fff7ed', color: '#ea580c' }}>
            <Calendar size={18} />
          </div>
          <div className="sltb-summary-content">
            <span className="sltb-summary-label">Joined Date</span>
            <span className="sltb-summary-value">{user.joinedDate}</span>
          </div>
        </div>
      </div>

      {/* User Information */}
      <UserInfoCard icon={User} title="User Information">
        <div className="sltb-user-info-body">
          <div className="sltb-user-avatar-wrap">
            <img
              src={user.avatar || defaultAvatar}
              alt={user.fullName}
              onError={(e) => {
                e.currentTarget.src = defaultAvatar;
              }}
            />
          </div>

          <div className="details-table-grid">
            <div>
              <InformationRow label="User ID" value={userIdDisplay} />
              <InformationRow label="Username" value={user.username} />
              <InformationRow label="Email" value={user.email} />
              <InformationRow label="Theme Preference" value={user.themePreference || 'Light'} />
              <InformationRow label="Created At" value={user.createdAt || '15 May 2023, 09:30 AM'} />
            </div>
            <div>
              <InformationRow label="Role" value={user.role} />
              <InformationRow label="Profile Image" value={user.profileImageStatus || 'Uploaded'} />
              <InformationRow label="Status" value={user.status} isStatus />
              <InformationRow label="Updated At" value={user.updatedAt || '02 May 2024, 03:15 PM'} />
            </div>
          </div>
        </div>
      </UserInfoCard>

      {/* SLTB User Information */}
      <UserInfoCard icon={Building2} title="SLTB User Information">
        <div className="details-table-grid">
          <div>
            <InformationRow label="SLTB User ID" value={sltbUserIdDisplay} />
            <InformationRow label="Full Name" value={user.fullName} />
            <InformationRow label="Employee ID" value={user.employeeId || `SLTB-EMP-0${user.id}`} />
            <InformationRow label="Department" value={user.department || 'Operations Department'} />
          </div>
          <div>
            <InformationRow
              label="User ID"
              value={`Linked from Step 1 (${userIdDisplay})`}
            />
            <InformationRow label="Designation" value={user.designation || 'Administrator'} />
            <InformationRow label="Phone" value={user.phone} />
            <InformationRow label="Joined Date" value={user.joinedDate} />
          </div>
        </div>
      </UserInfoCard>
    </>
  );
};

export default SLTBAdminDetails;
