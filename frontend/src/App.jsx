import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { USER_ROLES } from './constants/roles';
import { SplashPage } from './pages/SplashPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SLTBDashboardPage } from './pages/SLTBDashboardPage';
import { PoliceDashboard } from './pages/PoliceDashboard';
import { PoliceBusAlertsPage } from './pages/PoliceBusAlertsPage';
import { ViewBusAlertPage } from './pages/ViewBusAlertPage';
import { PoliceUTurnAlertsPage } from './pages/PoliceUTurnAlertsPage';
import { ViewUTurnAlertPage } from './pages/ViewUTurnAlertPage';
import { PoliceDeviceManagementPage } from './pages/PoliceDeviceManagementPage';
import { AddDevicePage } from './pages/AddDevicePage';
import { ViewDevicePage } from './pages/ViewDevicePage';
import { EditDevicePage } from './pages/EditDevicePage';
import { PoliceUserManagementPage } from './pages/PoliceUserManagementPage';
import { AddUserPage } from './pages/AddUserPage';
import { UserDetailsPage } from './pages/UserDetailsPage';
import { EditUserPage } from './pages/EditUserPage';
import { PoliceUTurnManagementPage } from './pages/PoliceUTurnManagementPage';
import { AddUTurnUnitPage } from './pages/AddUTurnUnitPage';
import { UTurnDetailsPage } from './pages/UTurnDetailsPage';
import { EditUTurnUnitPage } from './pages/EditUTurnUnitPage';
import { PoliceSystemLogsPage } from './pages/PoliceSystemLogsPage';
import { PoliceSettingsPage } from './pages/PoliceSettingsPage';
import { PoliceThemeSettingsPage } from './pages/PoliceThemeSettingsPage';
import { PoliceProfileSettingsPage } from './pages/PoliceProfileSettingsPage';
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
import { ReportsPage } from './pages/ReportsPage';
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

/**
 * Scalable Role-Based ProtectedRoute Component.
 * Validates authentication state and allowed user roles before rendering children.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
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

  if (allowedRoles && allowedRoles.length > 0) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!rolesArray.includes(user?.role_name)) {
      return <Navigate to="/unauthorized" replace />;
    }
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

              {/* Legacy redirect: /police/devices → /police/device-management */}
              <Route
                path="/police/devices"
                element={<Navigate to="/police/device-management" replace />}
              />

              {/* Protected Police Admin Routes */}
              <Route
                path="/police/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <PoliceDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/bus-alerts"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <PoliceBusAlertsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/bus-alerts/:id"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <ViewBusAlertPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/u-turn-alerts"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <PoliceUTurnAlertsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/u-turn-alerts/:id"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <ViewUTurnAlertPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/device-management"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <PoliceDeviceManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/device-management/add"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <AddDevicePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/device-management/:id"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <ViewDevicePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/device-management/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <EditDevicePage />
                  </ProtectedRoute>
                }
              />

              {/* Legacy redirect: /police/users → /police/user-management */}
              <Route
                path="/police/users"
                element={<Navigate to="/police/user-management" replace />}
              />

              <Route
                path="/police/user-management"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <PoliceUserManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/users/add"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <AddUserPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/user-management/add"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <AddUserPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/users/view/:userId"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <UserDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/user-management/view/:userId"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <UserDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/users/edit/:userId"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <EditUserPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/user-management/edit/:userId"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <EditUserPage />
                  </ProtectedRoute>
                }
              />

              {/* U-Turn Management Module */}
              <Route
                path="/police/uturn-management"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <PoliceUTurnManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/u-turn-management"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <PoliceUTurnManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/uturn-management/add"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <AddUTurnUnitPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/u-turn-management/add"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <AddUTurnUnitPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/uturn-management/view/:id"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <UTurnDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/uturn-management/view/:unitId"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <UTurnDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/u-turn-management/view/:id"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <UTurnDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/u-turn-management/view/:unitId"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <UTurnDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/uturn-management/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <EditUTurnUnitPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/uturn-management/edit/:unitId"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <EditUTurnUnitPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/u-turn-management/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <EditUTurnUnitPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/police/u-turn-management/edit/:unitId"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <EditUTurnUnitPage />
                  </ProtectedRoute>
                }
              />

              {/* Legacy redirect: /police/logs → /police/system-logs */}
              <Route
                path="/police/logs"
                element={<Navigate to="/police/system-logs" replace />}
              />

              <Route
                path="/police/system-logs"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <PoliceSystemLogsPage />
                  </ProtectedRoute>
                }
              />

              {/* Police Settings Routes */}
              <Route
                path="/police/settings"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <PoliceSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/police/settings/theme"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <PoliceThemeSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/police/settings/profile"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.POLICE_ADMIN]}>
                    <PoliceProfileSettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected SLTB Admin Routes */}
              <Route
                path="/sltb/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <SLTBDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/buses"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <BusManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/buses/new"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <AddBusPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/buses/:busId"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <BusDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/buses/:busId/edit"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <EditBusPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/routes"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <RouteManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/routes/new"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <AddRoutePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/routes/:routeId"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <RouteDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/routes/:routeId/edit"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <EditRoutePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/drivers"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <DriverManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/drivers/new"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <AddDriverPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/drivers/:driverId"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <DriverDetailsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/drivers/:driverId/edit"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <EditDriverPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/reports"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/profile"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/profile/edit"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sltb/settings"
                element={
                  <ProtectedRoute allowedRoles={[USER_ROLES.SLTB_ADMIN]}>
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
