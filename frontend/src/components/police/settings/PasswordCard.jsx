import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { profileService } from '../../../services/profileService';
import '../../../styles/settings.css';

/**
 * PasswordCard — Change Password section on the Profile Settings (edit) page.
 */
const PasswordCard = () => {
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false });
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  const toggle = (field) => setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  const handle = (field) => (e) => {
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswords((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const fields = [
    { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
    { key: 'newPw',   label: 'New Password',     placeholder: 'Enter new password' },
    { key: 'confirm', label: 'Confirm New Password', placeholder: 'Confirm new password' },
  ];

  const handleUpdatePassword = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwords.current) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!passwords.newPw) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (passwords.newPw.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (passwords.newPw !== passwords.confirm) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await profileService.updatePassword({
        current_password: passwords.current,
        new_password: passwords.newPw,
        confirm_password: passwords.confirm
      });

      if (res && res.success) {
        setPasswordSuccess('Password updated successfully.');
        setPasswords({ current: '', newPw: '', confirm: '' });
        setTimeout(() => setPasswordSuccess(null), 4000);
      } else {
        setPasswordError(res?.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error('[PasswordCard] update error:', err);
      setPasswordError(err?.message || err?.errors?.current_password || 'Current password is incorrect.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="settings-password-section" onSubmit={handleUpdatePassword}>
      <h3 className="settings-password-title">Change Password</h3>

      {passwordError && (
        <div style={{ padding: '0.65rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {passwordError}
        </div>
      )}

      {passwordSuccess && (
        <div style={{ padding: '0.65rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {passwordSuccess}
        </div>
      )}

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

      <button type="submit" className="btn-update-password" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 size={14} className="spinner" /> : <Lock size={14} />}
        <span>{isSubmitting ? 'Updating Password...' : 'Update Password'}</span>
      </button>
    </form>
  );
};

export default PasswordCard;
