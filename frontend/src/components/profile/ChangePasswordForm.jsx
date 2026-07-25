import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { passwordSchema } from '../../schemas/passwordSchemas';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  });

  const onSubmitPassword = async (data) => {
    setIsSubmitting(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      const res = await profileService.updatePassword(data);
      if (res && res.success) {
        setPasswordSuccess('Password changed successfully. Redirecting to login...');
        reset();
        setTimeout(async () => {
          await logout();
          navigate('/login?password_changed=1', { replace: true });
        }, 1500);
      } else {
        setPasswordError(res?.message || 'Failed to change password.');
      }
    } catch (err) {
      setPasswordError(err?.message || err?.errors?.current_password || 'The current password is incorrect.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-card" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>
        Change Password
      </h3>

      {passwordError && (
        <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {passwordError}
        </div>
      )}

      {passwordSuccess && (
        <div style={{ padding: '0.75rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {passwordSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmitPassword)}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem 1.5rem' }}>
          <div className="profile-form-group">
            <label>Current Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showCurrentPw ? 'text' : 'password'}
                className={`profile-input ${errors.current_password ? 'profile-input-error' : ''}`}
                placeholder="Enter current password"
                {...register('current_password')}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                aria-label="Toggle password visibility"
              >
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.current_password && <span className="error-text">{errors.current_password.message}</span>}
          </div>

          <div className="profile-form-group">
            <label>New Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showNewPw ? 'text' : 'password'}
                className={`profile-input ${errors.new_password ? 'profile-input-error' : ''}`}
                placeholder="Enter new password"
                {...register('new_password')}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowNewPw(!showNewPw)}
                aria-label="Toggle password visibility"
              >
                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.new_password && <span className="error-text">{errors.new_password.message}</span>}
          </div>

          <div className="profile-form-group">
            <label>Confirm New Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPw ? 'text' : 'password'}
                className={`profile-input ${errors.confirm_password ? 'profile-input-error' : ''}`}
                placeholder="Confirm new password"
                {...register('confirm_password')}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                aria-label="Toggle password visibility"
              >
                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirm_password && <span className="error-text">{errors.confirm_password.message}</span>}
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <button
            type="submit"
            className="btn-update-profile"
            disabled={isSubmitting}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isSubmitting ? <Loader2 size={16} className="spinner" /> : <Lock size={16} />}
            <span>{isSubmitting ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
