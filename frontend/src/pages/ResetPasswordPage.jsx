import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { resetPasswordSchema } from '../schemas/authSchemas';
import { authService } from '../services/authService';
import logoImg from '../assets/images/sltb_logo.png';
import '../styles/auth.css';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const res = await authService.resetPassword(token, data.new_password, data.confirm_password);
      if (res.success) {
        setSuccessMessage('Password reset successfully. Redirecting to login...');
        setTimeout(() => {
          navigate('/login?reset=1');
        }, 2000);
      } else {
        setServerError(res.message || 'Password reset failed.');
      }
    } catch (err) {
      setServerError(err.message || 'Invalid or expired password reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container" style={{ justifyContent: 'center' }}>
      <div className="auth-right-card" style={{ maxWidth: '440px' }}>
        <div className="card-header-logo">
          <img src={logoImg} alt="Logo" className="card-logo" />
          <h3>Reset Password</h3>
          <p>Set a new secure password for your account</p>
        </div>

        {serverError && <div className="alert-error">{serverError}</div>}
        {successMessage && <div className="alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="new_password">New Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon-left" />
              <input
                id="new_password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                className="form-input"
                {...register('new_password')}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.new_password && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.new_password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Confirm New Password</label>
            <div className="input-wrapper">
              <KeyRound size={18} className="input-icon-left" />
              <input
                id="confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter new password"
                className="form-input"
                {...register('confirm_password')}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirm_password && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.confirm_password.message}</span>}
          </div>

          <button type="submit" className="btn-primary-block" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner"></span> : <span>Reset Password</span>}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '1rem' }}>
          Remember your password? <Link to="/login" style={{ color: '#0047ff', fontWeight: 600 }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};
