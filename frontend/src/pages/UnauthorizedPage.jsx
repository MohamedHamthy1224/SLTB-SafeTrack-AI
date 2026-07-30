import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getDashboardRoute } from '../utils/roleRouter';
import '../styles/auth.css';

export const UnauthorizedPage = () => {
  const { user, isAuthenticated } = useAuth();
  const targetDashboard = user?.role_name ? getDashboardRoute(user.role_name) : '/login';

  return (
    <div className="auth-page-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="auth-right-card" style={{ textAlign: 'center', maxWidth: '460px', padding: '2.5rem 2rem' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}>
          <ShieldAlert size={42} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>Access Denied</h2>
        
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0.75rem 0 1.5rem', lineHeight: '1.6' }}>
          Your account role <strong>({user?.role_name || 'Guest'})</strong> is not authorized to view the requested page or module. Access is strictly controlled by Role-Based Access Control (RBAC) policies.
        </p>

        {isAuthenticated && user?.role_name ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to={targetDashboard} className="btn-primary-block" style={{ textDecoration: 'none' }}>
              <LayoutDashboard size={18} />
              <span>Go to My Dashboard</span>
            </Link>
            <Link to="/login" style={{ fontSize: '0.85rem', color: '#64748b', textDecoration: 'none' }}>
              Switch Account / Login
            </Link>
          </div>
        ) : (
          <Link to="/login" className="btn-primary-block" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
            <span>Return to Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};
