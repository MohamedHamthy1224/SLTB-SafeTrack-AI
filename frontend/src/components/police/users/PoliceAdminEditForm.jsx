import React from 'react';
import { User, Shield, Calendar } from 'lucide-react';
import PasswordField from './PasswordField';
import ImageUploader from './ImageUploader';
import '../../../styles/editUser.css';

const PoliceAdminEditForm = ({
  formData,
  errors,
  onChange,
  onImageChange,
  onImageRemove,
}) => {
  return (
    <>
      {/* Card 1: User Account Information */}
      <div className="edit-user-card">
        <div className="edit-user-section-header">
          <div className="edit-user-section-icon">
            <User size={16} />
          </div>
          <h3 className="edit-user-section-title">User Account Information</h3>
        </div>

        <div className="edit-user-form-grid">
          {/* Username */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">
              Username <span className="req">*</span>
            </label>
            <input
              type="text"
              className="edit-user-input"
              value={formData.username || ''}
              onChange={(e) => onChange('username', e.target.value)}
            />
            {errors.username && (
              <span className="edit-user-error-text">{errors.username}</span>
            )}
          </div>

          {/* Email */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">
              Email <span className="req">*</span>
            </label>
            <input
              type="email"
              className="edit-user-input"
              value={formData.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
            />
            {errors.email && (
              <span className="edit-user-error-text">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Password</label>
            <PasswordField
              value={formData.password || ''}
              onChange={(e) => onChange('password', e.target.value)}
              placeholder="Leave blank to keep existing password"
            />
          </div>

          {/* Profile Image */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Profile Image</label>
            <ImageUploader
              imagePreview={formData.imagePreview}
              onImageChange={onImageChange}
              onImageRemove={onImageRemove}
            />
          </div>

          {/* Theme Preference */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Theme Preference</label>
            <select
              className="edit-user-select"
              value={formData.themePreference || 'Light'}
              onChange={(e) => onChange('themePreference', e.target.value)}
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
              <option value="System Default">System Default</option>
            </select>
          </div>

          {/* Status */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Status</label>
            <select
              className="edit-user-select"
              value={formData.status || 'Active'}
              onChange={(e) => onChange('status', e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Card 2: Police Officer Information */}
      <div className="edit-user-card">
        <div className="edit-user-section-header">
          <div className="edit-user-section-icon">
            <Shield size={16} />
          </div>
          <h3 className="edit-user-section-title">Police Officer Information</h3>
        </div>

        <div className="edit-user-form-grid">
          {/* Full Name */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">
              Full Name <span className="req">*</span>
            </label>
            <input
              type="text"
              className="edit-user-input"
              value={formData.fullName || ''}
              onChange={(e) => onChange('fullName', e.target.value)}
            />
            {errors.fullName && (
              <span className="edit-user-error-text">{errors.fullName}</span>
            )}
          </div>

          {/* Badge Number */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">
              Badge Number <span className="req">*</span>
            </label>
            <input
              type="text"
              className="edit-user-input"
              value={formData.badgeNumber || ''}
              onChange={(e) => onChange('badgeNumber', e.target.value)}
            />
            {errors.badgeNumber && (
              <span className="edit-user-error-text">{errors.badgeNumber}</span>
            )}
          </div>

          {/* Rank */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Rank</label>
            <select
              className="edit-user-select"
              value={formData.rank || ''}
              onChange={(e) => onChange('rank', e.target.value)}
            >
              <option value="">Select rank</option>
              <option value="Inspector">Inspector</option>
              <option value="Chief Inspector">Chief Inspector</option>
              <option value="Sergeant">Sergeant</option>
              <option value="Constable">Constable</option>
              <option value="Sub-Inspector">Sub-Inspector</option>
            </select>
          </div>

          {/* Police Station */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Police Station</label>
            <input
              type="text"
              className="edit-user-input"
              value={formData.policeStation || ''}
              onChange={(e) => onChange('policeStation', e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Phone</label>
            <input
              type="tel"
              className="edit-user-input"
              value={formData.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
            />
            {errors.phone && (
              <span className="edit-user-error-text">{errors.phone}</span>
            )}
          </div>

          {/* Joined Date */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Joined Date</label>
            <div className="edit-user-date-wrap">
              <input
                type="text"
                className="edit-user-input"
                value={formData.joinedDate || ''}
                onChange={(e) => onChange('joinedDate', e.target.value)}
              />
              <Calendar size={15} className="edit-user-date-icon" />
            </div>
          </div>

          {/* Device Token */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Device Token</label>
            <input
              type="text"
              className="edit-user-input"
              value={formData.deviceToken || ''}
              onChange={(e) => onChange('deviceToken', e.target.value)}
            />
          </div>

          {/* Is Online */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Online Status</label>
            <select
              className="edit-user-select"
              value={formData.isOnline || 'Online'}
              onChange={(e) => onChange('isOnline', e.target.value)}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default PoliceAdminEditForm;
