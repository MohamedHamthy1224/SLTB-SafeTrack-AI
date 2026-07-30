import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import SettingsTabs from '../components/police/settings/SettingsTabs';
import ProfileViewCard from '../components/police/settings/ProfileViewCard';
import ProfileInformationCard from '../components/police/settings/ProfileInformationCard';
import OfficerInformationCard from '../components/police/settings/OfficerInformationCard';
import { mockOfficerProfile } from '../data/settingsMockData';
import '../styles/police-dashboard.css';
import '../styles/settings.css';

/**
 * PoliceSettingsPage — /police/settings
 * Redirects to /police/settings/profile.
 * Shows the View Profile tab content (read-only profile view).
 */
export const PoliceSettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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

          {/* Tabs */}
          <SettingsTabs />

          {/* View Profile Header Row */}
          <div className="settings-view-profile-header">
            <h2 className="settings-view-profile-title">View Profile</h2>
            <Link to="/police/settings/profile" className="btn-edit-profile">
              <Pencil size={14} />
              Edit Profile
            </Link>
          </div>

          {/* Three-column layout */}
          <div className="settings-profile-grid">
            <ProfileViewCard profile={mockOfficerProfile} />
            <ProfileInformationCard profile={mockOfficerProfile} />
            <OfficerInformationCard />
          </div>

          {/* Footer */}
          <p className="settings-page-footer">
            © 2025 SLTB SafeTrack AI. All rights reserved.
          </p>
        </main>
      </div>
    </div>
  );
};

export default PoliceSettingsPage;
