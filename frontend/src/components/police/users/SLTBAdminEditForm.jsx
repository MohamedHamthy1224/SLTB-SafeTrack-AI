import React from 'react';
import { User, Building2, Calendar } from 'lucide-react';
import PasswordField from './PasswordField';
import '../../../styles/editUser.css';

const SLTBAdminEditForm = ({
  formData,
  errors,
  onChange,
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

      {/* Card 2: SLTB User Information */}
      <div className="edit-user-card">
        <div className="edit-user-section-header">
          <div className="edit-user-section-icon">
            <Building2 size={16} />
          </div>
          <h3 className="edit-user-section-title">SLTB User Information</h3>
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

          {/* Employee ID */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">
              Employee ID <span className="req">*</span>
            </label>
            <input
              type="text"
              className="edit-user-input"
              value={formData.employeeId || ''}
              onChange={(e) => onChange('employeeId', e.target.value)}
            />
            {errors.employeeId && (
              <span className="edit-user-error-text">{errors.employeeId}</span>
            )}
          </div>

          {/* Designation */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Designation</label>
            <input
              type="text"
              className="edit-user-input"
              value={formData.designation || ''}
              onChange={(e) => onChange('designation', e.target.value)}
            />
          </div>

          {/* Department */}
          <div className="edit-user-field-group">
            <label className="edit-user-label">Department</label>
            <input
              type="text"
              className="edit-user-input"
              value={formData.department || ''}
              onChange={(e) => onChange('department', e.target.value)}
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
        </div>
      </div>
    </>
  );
};

export default SLTBAdminEditForm;
