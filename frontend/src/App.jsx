import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SplashPage } from './pages/SplashPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SLTBDashboardPage } from './pages/SLTBDashboardPage';
import { BusManagementPage } from './pages/BusManagementPage';
import { AddBusPage } from './pages/AddBusPage';
import { BusDetailsPage } from './pages/BusDetailsPage';
import { EditBusPage } from './pages/EditBusPage';
import { RouteManagementPage } from './pages/RouteManagementPage';
import { AddRoutePage } from './pages/AddRoutePage';
import { RouteDetailsPage } from './pages/RouteDetailsPage';
import { EditRoutePage } from './pages/EditRoutePage';
import { DriverManagementPage } from './pages/DriverManagementPage';
import { AddDriverPage } from './pages/AddDriverPage';
import { DriverDetailsPage } from './pages/DriverDetailsPage';
import { EditDriverPage } from './pages/EditDriverPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ModulePlaceholderPage } from './pages/ModulePlaceholderPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './styles/global.css';
import './styles/responsive.css';
import './styles/busManagement.css';
import './styles/busForm.css';
import './styles/busDetails.css';
import './styles/routeManagement.css';
import './styles/routeForm.css';
import './styles/routeDetails.css';
import './styles/routeModal.css';

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
        <ThemeProvider>
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
                    <BusManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/buses/new"
                element={
                  <ProtectedRoute>
                    <AddBusPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/buses/:busId"
                element={
                  <ProtectedRoute>
                    <BusDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/buses/:busId/edit"
                element={
                  <ProtectedRoute>
                    <EditBusPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/routes"
                element={
                  <ProtectedRoute>
                    <RouteManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/routes/new"
                element={
                  <ProtectedRoute>
                    <AddRoutePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/routes/:routeId"
                element={
                  <ProtectedRoute>
                    <RouteDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/routes/:routeId/edit"
                element={
                  <ProtectedRoute>
                    <EditRoutePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/drivers"
                element={
                  <ProtectedRoute>
                    <DriverManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/drivers/new"
                element={
                  <ProtectedRoute>
                    <AddDriverPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/drivers/:driverId"
                element={
                  <ProtectedRoute>
                    <DriverDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/drivers/:driverId/edit"
                element={
                  <ProtectedRoute>
                    <EditDriverPage />
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
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
