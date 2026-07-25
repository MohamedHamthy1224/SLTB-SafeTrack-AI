import React from 'react';
import { Link } from 'react-router-dom';
import { User, Pencil } from 'lucide-react';

export const PersonalInformationCard = ({ profile }) => {
  if (!profile) return null;

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

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'Not Available';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="profile-card">
      <div className="card-header-flex">
        <div className="card-title-flex">
          <div className="card-title-icon">
            <User size={18} />
          </div>
          <h3 className="card-title-text">Personal Information</h3>
        </div>

        <Link to="/sltb/profile/edit" className="btn-edit-profile">
          <Pencil size={15} />
          <span>Edit</span>
        </Link>
      </div>

      <div className="info-fields-grid">
        <div className="info-field-group">
          <label>Full Name</label>
          <div className="info-field-box">{profile.fullName || 'Not Available'}</div>
        </div>

        <div className="info-field-group">
          <label>Username</label>
          <div className="info-field-box disabled">{profile.username || 'Not Available'}</div>
        </div>

        <div className="info-field-group">
          <label>Email Address</label>
          <div className="info-field-box">{profile.emailAddress || 'Not Available'}</div>
        </div>

        <div className="info-field-group">
          <label>Role</label>
          <div className="info-field-box disabled">{profile.roleName || 'SLTB Admin'}</div>
        </div>

        <div className="info-field-group">
          <label>Phone Number</label>
          <div className="info-field-box">{profile.phone || 'Not Available'}</div>
        </div>

        <div className="info-field-group">
          <label>Status</label>
          <div className="info-field-box disabled">
            <span className={`profile-status-badge ${String(profile.status || 'Active').toLowerCase()}`} style={{ padding: 0 }}>
              <span className="profile-status-dot" />
              <span>{profile.status || 'Active'}</span>
            </span>
          </div>
        </div>

        <div className="info-field-group">
          <label>Employee ID</label>
          <div className="info-field-box">{profile.employeeId || 'Not Available'}</div>
        </div>

        <div className="info-field-group">
          <label>Joined Date</label>
          <div className="info-field-box">{formatDate(profile.joinedDate)}</div>
        </div>

        <div className="info-field-group">
          <label>Department</label>
          <div className="info-field-box">{profile.department || 'Not Available'}</div>
        </div>

        <div className="info-field-group">
          <label>Created At</label>
          <div className="info-field-box disabled">{formatDateTime(profile.createdAt)}</div>
        </div>

        <div className="info-field-group">
          <label>Designation</label>
          <div className="info-field-box">{profile.designation || 'Not Available'}</div>
        </div>

        <div className="info-field-group">
          <label>Updated At</label>
          <div className="info-field-box disabled">{formatDateTime(profile.updatedAt)}</div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationCard;
