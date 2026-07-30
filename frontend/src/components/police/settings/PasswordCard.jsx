import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import '../../../styles/settings.css';

/**
 * PasswordCard — Change Password section on the Profile Settings (edit) page.
 */
const PasswordCard = () => {
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false });
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });

  const toggle = (field) => setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  const handle = (field) => (e) =>
    setPasswords((prev) => ({ ...prev, [field]: e.target.value }));

  const fields = [
    { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
    { key: 'newPw',   label: 'New Password',     placeholder: 'Enter new password' },
    { key: 'confirm', label: 'Confirm New Password', placeholder: 'Confirm new password' },
  ];

  return (
    <div className="settings-password-section">
      <h3 className="settings-password-title">Change Password</h3>

      <div className="settings-password-grid">
        {fields.map(({ key, label, placeholder }) => (
          <div className="settings-form-field" key={key}>
            <label className="settings-form-label">
              {label} <span className="req">*</span>
            </label>
            <div className="settings-password-input-wrap">
              <input
                className="settings-form-input"
                type={show[key] ? 'text' : 'password'}
                placeholder={placeholder}
                value={passwords[key]}
                onChange={handle(key)}
                style={{ paddingRight: '2.5rem' }}
              />
              <span
                className="settings-pw-eye"
                onClick={() => toggle(key)}
              >
                {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-update-password">
        <Lock size={14} />
        Update Password
      </button>
    </div>
  );
};

export default PasswordCard;
