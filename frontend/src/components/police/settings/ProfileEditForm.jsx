import React from 'react';
import { Calendar } from 'lucide-react';
import '../../../styles/settings.css';

/**
 * ProfileEditForm — right column of the Profile Settings (edit) page.
 * All form fields with validation-ready structure.
 */
const ProfileEditForm = ({ formData, onChange }) => {
  const handle = (field) => (e) => onChange(field, e.target.value);

  return (
    <div className="settings-edit-form-card">
      <h3 className="settings-edit-form-title">Profile Information</h3>

      <div className="settings-form-grid">
        {/* Full Name */}
        <div className="settings-form-field">
          <label className="settings-form-label">
            Full Name <span className="req">*</span>
          </label>
          <input
            className="settings-form-input"
            type="text"
            placeholder="Police Admin"
            value={formData.displayName || ''}
            onChange={handle('displayName')}
          />
        </div>

        {/* Rank */}
        <div className="settings-form-field">
          <label className="settings-form-label">
            Rank <span className="req">*</span>
          </label>
          <input
            className="settings-form-input"
            type="text"
            placeholder="Inspector"
            value={formData.rank || ''}
            onChange={handle('rank')}
          />
        </div>

        {/* Username */}
        <div className="settings-form-field">
          <label className="settings-form-label">
            Username <span className="req">*</span>
          </label>
          <input
            className="settings-form-input readonly"
            type="text"
            placeholder="policeadmin"
            value={formData.username || ''}
            readOnly
          />
        </div>

        {/* Police Station */}
        <div className="settings-form-field">
          <label className="settings-form-label">
            Police Station <span className="req">*</span>
          </label>
          <input
            className="settings-form-input"
            type="text"
            placeholder="Colombo Traffic Division"
            value={formData.policeStation || ''}
            onChange={handle('policeStation')}
          />
        </div>

        {/* Email Address */}
        <div className="settings-form-field">
          <label className="settings-form-label">
            Email Address <span className="req">*</span>
          </label>
          <input
            className="settings-form-input"
            type="email"
            placeholder="policeadmin@sltb.gov.lk"
            value={formData.email || ''}
            onChange={handle('email')}
          />
        </div>

        {/* Phone Number */}
        <div className="settings-form-field">
          <label className="settings-form-label">
            Phone Number <span className="req">*</span>
          </label>
          <input
            className="settings-form-input"
            type="tel"
            placeholder="077 123 4567"
            value={formData.phone || ''}
            onChange={handle('phone')}
          />
        </div>

        {/* Role — readonly */}
        <div className="settings-form-field">
          <label className="settings-form-label">Role</label>
          <input
            className="settings-form-input readonly"
            type="text"
            value={formData.role || ''}
            readOnly
          />
        </div>

        {/* Joined Date */}
        <div className="settings-form-field">
          <label className="settings-form-label">
            Joined Date <span className="req">*</span>
          </label>
          <div className="settings-form-input-date-wrap">
            <Calendar size={14} className="date-icon" />
            <input
              className="settings-form-input"
              type="text"
              value={formData.joinedDate || ''}
              readOnly
            />
          </div>
        </div>

        {/* Badge Number — readonly */}
        <div className="settings-form-field">
          <label className="settings-form-label">
            Badge Number <span className="req">*</span>
          </label>
          <input
            className="settings-form-input readonly"
            type="text"
            value={formData.badgeNumber || ''}
            readOnly
          />
        </div>

        {/* Status */}
        <div className="settings-form-field">
          <label className="settings-form-label">
            Status <span className="req">*</span>
          </label>
          <select
            className="settings-form-select"
            value={formData.status || 'Active'}
            onChange={handle('status')}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;
