import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  Bus, 
  AlertTriangle, 
  BarChart2, 
  ShieldCheck, 
  Lock, 
  Shield 
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import logoImg from '../assets/images/sltb_logo.png';
import busBgImg from '../assets/images/sltb_bus_bg.jpg';
import '../styles/splash.css';

export const SplashPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [publicStats, setPublicStats] = useState(null);

  useEffect(() => {
    // Non-blocking fetch of public statistics
    let isMounted = true;
    dashboardService.getPublicStats()
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setPublicStats(res.data);
        }
      })
      .catch((err) => {
        console.warn('Splash stats non-blocking fetch notice:', err);
      });

    // Animate progress bar from 0 to 100 over 2.5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/login');
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="splash-container">
      {/* Top Contact Bar */}
      <div className="splash-topbar">
        <div className="topbar-left">
          <div className="topbar-item">
            <Phone size={14} />
            <span>0112 345 678</span>
          </div>
          <div className="topbar-item">
            <Mail size={14} />
            <span>support@sltbsafetrack.lk</span>
          </div>
        </div>

        <div className="topbar-right">
          <span>Follow Us :</span>
          <div className="social-icons">
            <a href="#facebook" className="social-icon" aria-label="Facebook">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#twitter" className="social-icon" aria-label="Twitter">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/></svg>
            </a>
            <a href="#youtube" className="social-icon" aria-label="YouTube">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#linkedin" className="social-icon" aria-label="LinkedIn">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Header Branding */}
      <header className="splash-header">
        <div className="splash-brand">
          <img src={logoImg} alt="SLTB SafeTrack AI Logo" className="splash-logo" />
          <div className="splash-brand-text">
            <h1>SLTB SafeTrack AI</h1>
            <p>Sri Lanka Transport Board</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="splash-hero">
        <div className="splash-hero-left">
          <span className="hero-tagline">AI POWERED • SAFE JOURNEYS • SECURE SRI LANKA</span>
          <h2 className="hero-heading">
            Smart Monitoring for <span className="highlight">Safer Roads</span>
          </h2>
          <p className="hero-desc">
            Advanced AI technology for real-time monitoring, safety alerts, and intelligent transport management across Sri Lanka.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Bus size={22} />
              </div>
              <span>Real-time Monitoring</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <AlertTriangle size={22} />
              </div>
              <span>Smart Alerts</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <BarChart2 size={22} />
              </div>
              <span>AI Powered Analytics</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={22} />
              </div>
              <span>Secure & Reliable</span>
            </div>
          </div>
        </div>

        <div className="splash-hero-right">
          <img src={busBgImg} alt="SLTB Bus on Sri Lankan Road" className="bus-banner-image" />
        </div>
      </main>

      {/* Progress Section */}
      <section className="splash-progress-section">
        <div className="splash-loading-badge">
          <img src={logoImg} alt="Logo Badge" className="splash-mini-logo" />
          <span>Loading <strong>SLTB <span style={{ color: '#ffb800' }}>SafeTrack</span> AI...</strong></span>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <span className="progress-text">Loading... {progress}%</span>
      </section>

      {/* Security Access Banner */}
      <section className="splash-security-banner">
        <div className="banner-left">
          <div className="banner-left-icon">
            <Lock size={22} />
          </div>
          <div className="banner-left-text">
            <h4>This system is accessible only to authorized users.</h4>
            <p>SLTB employees and Police officers can login to access the system.</p>
          </div>
        </div>

        <div className="banner-right">
          <div className="badge-item">
            <div className="badge-icon">
              <Bus size={18} />
            </div>
            <div className="badge-info">
              <h5>SLTB</h5>
              <p>Authorized Users</p>
            </div>
          </div>

          <div className="badge-item">
            <div className="badge-icon">
              <Shield size={18} />
            </div>
            <div className="badge-info">
              <h5>Police Officers</h5>
              <p>Authorized Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="splash-footer">
        © {new Date().getFullYear()} Sri Lanka Transport Board. All rights reserved.
      </footer>
    </div>
  );
};
