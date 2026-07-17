import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ArrowLeft, 
  Mail, 
  Send, 
  Info, 
  Bus, 
  AlertTriangle, 
  ShieldCheck, 
  BarChart2, 
  MapPin, 
  Lock 
} from 'lucide-react';
import { forgotPasswordSchema } from '../schemas/authSchemas';
import { authService } from '../services/authService';
import logoImg from '../assets/images/sltb_logo.png';
import busBgImg from '../assets/images/sltb_bus_bg.jpg';
import '../styles/auth.css';

export const ForgotPasswordPage = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await authService.requestPasswordReset(data.email);
      setSuccessMessage(res.message || 'If an eligible account exists for this email, a password reset link has been sent.');
    } catch (err) {
      setErrorMessage(err.message || 'Unable to process password reset request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Top Header Branding */}
      <header className="auth-header">
        <img src={logoImg} alt="SLTB SafeTrack AI" className="auth-header-logo" />
        <div className="auth-header-title">
          <h2>SLTB SafeTrack AI</h2>
          <p>Sri Lanka Transport Board</p>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="auth-main-content">
        {/* Left Branding Panel */}
        <div className="auth-left-panel">
          <h2 className="auth-heading">
            Smart Monitoring for <br /><span className="highlight">Safer Roads</span>
          </h2>
          <p className="auth-description">
            SLTB SafeTrack AI is an intelligent monitoring system that ensures bus safety, reduces accidents, and protects lives using advanced AI and IoT technology.
          </p>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon"><Bus size={18} /></div>
              <div className="auth-feature-text">
                <h5>Real-time Monitoring</h5>
                <p>Live tracking of SLTB buses and road safety conditions.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon"><AlertTriangle size={18} /></div>
              <div className="auth-feature-text">
                <h5>Instant Safety Alerts</h5>
                <p>Immediate alerts for violations and risk detections.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon"><BarChart2 size={18} /></div>
              <div className="auth-feature-text">
                <h5>AI Analytics & Reports</h5>
                <p>AI-powered insights and predictive reports.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon"><ShieldCheck size={18} /></div>
              <div className="auth-feature-text">
                <h5>Secure & Reliable</h5>
                <p>Advanced security to protect all data and operations.</p>
              </div>
            </div>
          </div>

          <img src={busBgImg} alt="SLTB Bus" className="auth-bus-image" />

          {/* Stats Bar */}
          <div className="stats-cards-row">
            <div className="stat-box">
              <Bus size={18} className="stat-icon" />
              <div className="stat-info">
                <h6>Total Buses</h6>
                <span>1,248</span>
              </div>
            </div>

            <div className="stat-box">
              <AlertTriangle size={18} className="stat-icon" style={{ color: '#f59e0b' }} />
              <div className="stat-info">
                <h6>Active Alerts</h6>
                <span>23</span>
              </div>
            </div>

            <div className="stat-box">
              <ShieldCheck size={18} className="stat-icon" style={{ color: '#10b981' }} />
              <div className="stat-info">
                <h6>Safe Journeys</h6>
                <span>98.6%</span>
              </div>
            </div>

            <div className="stat-box">
              <MapPin size={18} className="stat-icon" style={{ color: '#a855f7' }} />
              <div className="stat-info">
                <h6>Districts Covered</h6>
                <span>25</span>
              </div>
            </div>
          </div>

          <div className="auth-security-note">
            <Lock size={16} style={{ color: '#60a5fa' }} />
            <div>
              <strong>Authorized Access Only:</strong> This system is accessible only to authorized SLTB employees and Police officers. All activities are monitored and recorded.
            </div>
          </div>
        </div>

        {/* Right White Forgot Password Card */}
        <div className="auth-right-card">
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#0047ff' }}>
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>

          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>Forgot Password?</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.4' }}>
              No worries! Enter your registered email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {successMessage && <div className="alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert-error">{errorMessage}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon-left" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  className="form-input"
                  autoComplete="email"
                  {...register('email')}
                />
              </div>
              {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.email.message}</span>}
            </div>

            <div className="auth-bottom-banner" style={{ background: '#eff6ff', borderRadius: '8px' }}>
              <Info size={18} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ fontSize: '0.775rem', color: '#1e40af', lineHeight: '1.4' }}>
                If you don't receive the email within a few minutes, please check your spam or junk folder.
              </p>
            </div>

            <button type="submit" className="btn-primary-block" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '1rem' }}>
            Remember your password? <Link to="/login" style={{ color: '#0047ff', fontWeight: 600 }}>Back to Login</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        © {new Date().getFullYear()} Sri Lanka Transport Board. All rights reserved.
      </footer>
    </div>
  );
};
