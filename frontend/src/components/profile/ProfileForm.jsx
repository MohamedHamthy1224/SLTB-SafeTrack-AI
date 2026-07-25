import React from 'react';

export const ProfileForm = ({ register, errors, roleName, username }) => {
  return (
    <div className="profile-card">
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>
        Personal Information
      </h3>

      <div className="form-grid-2">
        <div className="profile-form-group">
          <label>Full Name *</label>
          <input
            type="text"
            className={`profile-input ${errors.full_name ? 'profile-input-error' : ''}`}
            placeholder="Enter full name"
            {...register('full_name')}
          />
          {errors.full_name && <span className="error-text">{errors.full_name.message}</span>}
        </div>

        <div className="profile-form-group">
          <label>Username *</label>
          <input
            type="text"
            className="profile-input disabled"
            value={username || ''}
            disabled
            readOnly
          />
        </div>

        <div className="profile-form-group">
          <label>Email Address *</label>
          <input
            type="email"
            className={`profile-input ${errors.email_address ? 'profile-input-error' : ''}`}
            placeholder="admin@sltb.lk"
            {...register('email_address')}
          />
          {errors.email_address && <span className="error-text">{errors.email_address.message}</span>}
        </div>

        <div className="profile-form-group">
          <label>Role</label>
          <input
            type="text"
            className="profile-input disabled"
            value={roleName || 'SLTB Admin'}
            disabled
            readOnly
          />
        </div>

        <div className="profile-form-group">
          <label>Employee ID *</label>
          <input
            type="text"
            className={`profile-input ${errors.employee_id ? 'profile-input-error' : ''}`}
            placeholder="SLTB-EMP-001"
            {...register('employee_id')}
          />
          {errors.employee_id && <span className="error-text">{errors.employee_id.message}</span>}
        </div>

        <div className="profile-form-group">
          <label>Department</label>
          <input
            type="text"
            className={`profile-input ${errors.department ? 'profile-input-error' : ''}`}
            placeholder="e.g. Operations"
            {...register('department')}
          />
          {errors.department && <span className="error-text">{errors.department.message}</span>}
        </div>

        <div className="profile-form-group">
          <label>Designation</label>
          <input
            type="text"
            className={`profile-input ${errors.designation ? 'profile-input-error' : ''}`}
            placeholder="e.g. Administrator"
            {...register('designation')}
          />
          {errors.designation && <span className="error-text">{errors.designation.message}</span>}
        </div>

        <div className="profile-form-group">
          <label>Phone Number</label>
          <input
            type="text"
            className={`profile-input ${errors.phone ? 'profile-input-error' : ''}`}
            placeholder="+94 77 123 4567"
            {...register('phone')}
          />
          {errors.phone && <span className="error-text">{errors.phone.message}</span>}
        </div>

        <div className="profile-form-group">
          <label>Joined Date</label>
          <input
            type="date"
            className={`profile-input ${errors.joined_date ? 'profile-input-error' : ''}`}
            {...register('joined_date')}
          />
          {errors.joined_date && <span className="error-text">{errors.joined_date.message}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
