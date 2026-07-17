import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SplashPage } from './pages/SplashPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SLTBDashboardPage } from './pages/SLTBDashboardPage';
import { ModulePlaceholderPage } from './pages/ModulePlaceholderPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './styles/global.css';
import './styles/responsive.css';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#051026', color: '#fff' }}>
        <div className="spinner" style={{ width: 36, height: 36 }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role_name !== 'SLTB Admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected SLTB Admin Routes */}
            <Route
              path="/sltb/dashboard"
              element={
                <ProtectedRoute>
                  <SLTBDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sltb/buses"
              element={
                <ProtectedRoute>
                  <ModulePlaceholderPage 
                    moduleTitle="Bus Management Module" 
                    moduleDescription="Bus fleet management, device binding, and vehicle status controls." 
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sltb/drivers"
              element={
                <ProtectedRoute>
                  <ModulePlaceholderPage 
                    moduleTitle="Driver Management Module" 
                    moduleDescription="Driver registration, experience records, licensing, and shift schedules." 
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sltb/routes"
              element={
                <ProtectedRoute>
                  <ModulePlaceholderPage 
                    moduleTitle="Route Management Module" 
                    moduleDescription="Route mapping, start/end locations, distance tracking, and roadside unit alignment." 
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sltb/reports"
              element={
                <ProtectedRoute>
                  <ModulePlaceholderPage 
                    moduleTitle="Analytics & Reports Module" 
                    moduleDescription="Comprehensive reports engine including Bus, Driver, Route, Alert, and Approach Speed analysis." 
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sltb/profile"
              element={
                <ProtectedRoute>
                  <ModulePlaceholderPage 
                    moduleTitle="SLTB Admin Profile" 
                    moduleDescription="Employee credentials, department info, designation, and account details." 
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sltb/settings"
              element={
                <ProtectedRoute>
                  <ModulePlaceholderPage 
                    moduleTitle="System Settings" 
                    moduleDescription="Distance thresholds, alert preferences, log intervals, and security settings." 
                  />
                </ProtectedRoute>
              }
            />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
