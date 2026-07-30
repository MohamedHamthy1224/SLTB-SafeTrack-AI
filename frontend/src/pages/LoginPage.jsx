import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Bus, 
  AlertTriangle, 
  ShieldCheck, 
  BarChart2, 
  MapPin, 
  Shield 
} from 'lucide-react';
import { loginSchema } from '../schemas/authSchemas';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import logoImg from '../assets/images/sltb_logo.png';
import busBgImg from '../assets/images/sltb_bus_bg.jpg';
import { getDashboardRoute } from '../utils/roleRouter';
import '../styles/auth.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicStats, setPublicStats] = useState({
    totalBuses: 1248,
    activeAlerts: 23,
    safeJourneysPercentage: 98.6,
    districtsCovered: 25
  });

  const rememberedIdentifier = localStorage.getItem('sltb_remembered_user') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: rememberedIdentifier,
      password: '',
      rememberMe: !!rememberedIdentifier
    }
  });

  useEffect(() => {
    if (isAuthenticated && user?.role_name) {
      const targetRoute = getDashboardRoute(user.role_name);
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Fetch live public statistics from backend
    dashboardService.getPublicStats()
      .then((res) => {
        if (res.success && res.data) {
          setPublicStats((prev) => ({
            ...prev,
            totalBuses: res.data.totalBuses || prev.totalBuses,
            districtsCovered: res.data.districtsCovered || prev.districtsCovered,
            safeJourneysPercentage: res.data.safeJourneysPercentage || prev.safeJourneysPercentage
          }));
        }
      })
      .catch((err) => console.warn('Public stats notice:', err));
  }, []);

  const onSubmit = async (data) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      const res = await login(data.identifier, data.password, data.rememberMe);
      if (res.success && res.data?.user) {
        const targetRoute = getDashboardRoute(res.data.user.role_name);
        navigate(targetRoute);
      } else {
        setServerError(res.message || 'Authentication failed.');
      }
    } catch (err) {
      setServerError(err.message || 'Invalid username/email or password.');
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
                <span>{publicStats.totalBuses.toLocaleString()}</span>
              </div>
            </div>

            <div className="stat-box">
              <AlertTriangle size={18} className="stat-icon" style={{ color: '#f59e0b' }} />
              <div className="stat-info">
                <h6>Active Alerts</h6>
                <span>{publicStats.activeAlerts}</span>
              </div>
            </div>

            <div className="stat-box">
              <ShieldCheck size={18} className="stat-icon" style={{ color: '#10b981' }} />
              <div className="stat-info">
                <h6>Safe Journeys</h6>
                <span>{publicStats.safeJourneysPercentage}%</span>
              </div>
            </div>

            <div className="stat-box">
              <MapPin size={18} className="stat-icon" style={{ color: '#a855f7' }} />
              <div className="stat-info">
                <h6>Districts Covered</h6>
                <span>{publicStats.districtsCovered}</span>
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

        {/* Right White Login Card */}
        <div className="auth-right-card">
          <div className="card-header-logo">
            <img src={logoImg} alt="Logo" className="card-logo" />
            <p>Welcome to</p>
            <h3>SLTB SafeTrack <span>AI</span></h3>
            <p style={{ marginTop: '0.25rem' }}>Sign in to continue</p>
          </div>

          {serverError && <div className="alert-error">{serverError}</div>}
          {location.search.includes('expired=1') && (
            <div className="alert-error">Your session has expired. Please sign in again.</div>
          )}
          {location.search.includes('reset=1') && (
            <div className="alert-success">Password updated successfully.</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="identifier">Email Address or Username</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon-left" />
                <input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or username"
                  className="form-input"
                  autoComplete="username"
                  {...register('identifier')}
                />
              </div>
              {errors.identifier && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.identifier.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon-left" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="form-input"
                  autoComplete="current-password"
                  {...register('password')}
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
              {errors.password && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem' }}>{errors.password.message}</span>}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" {...register('rememberMe')} />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-primary-block" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-bottom-banner">
            <Shield size={20} className="banner-icon" />
            <div className="banner-text">
              <h5>Secure. Intelligent. Connected.</h5>
              <p>Building a safer transportation system for Sri Lanka.</p>
            </div>
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
