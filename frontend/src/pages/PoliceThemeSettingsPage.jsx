import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import SettingsTabs from '../components/police/settings/SettingsTabs';
import ThemeSettingsCard from '../components/police/settings/ThemeSettingsCard';
import '../styles/police-dashboard.css';
import '../styles/settings.css';

/**
 * PoliceThemeSettingsPage — /police/settings/theme
 * Shows Theme Settings tab active with centered theme card.
 */
export const PoliceThemeSettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="police-dashboard-layout">
      <PoliceSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="police-dashboard-main">
        <PoliceDashboardHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="settings-container">
          {/* Page Title & Breadcrumb */}
          <h1 className="settings-page-title">Settings</h1>
          <nav className="settings-breadcrumb">
            <Link to="/police/dashboard">Dashboard</Link>
            <span className="bc-sep">&gt;</span>
            <span className="bc-current">Settings</span>
          </nav>

          {/* Tabs — Theme Settings tab will be active via NavLink */}
          <SettingsTabs />

          {/* Theme Settings Card */}
          <ThemeSettingsCard />

          {/* Footer */}
          <p className="settings-page-footer">
            © 2025 SLTB SafeTrack AI. All rights reserved.
          </p>
        </main>
      </div>
    </div>
  );
};

export default PoliceThemeSettingsPage;
