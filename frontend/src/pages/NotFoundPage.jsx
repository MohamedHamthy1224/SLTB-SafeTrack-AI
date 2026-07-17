import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import '../styles/auth.css';

export const NotFoundPage = () => {
  return (
    <div className="auth-page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="auth-right-card" style={{ textAlign: 'center', maxWidth: '440px' }}>
        <div style={{ color: '#0047ff', marginBottom: '1rem' }}>
          <HelpCircle size={54} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>404 - Page Not Found</h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.5rem 0 1.5rem' }}>
          The page you are looking for does not exist or has been moved.
        </p>

        <Link to="/sltb/dashboard" className="btn-primary-block" style={{ textDecoration: 'none' }}>
          <ArrowLeft size={18} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
