import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import SettingsTabs from '../components/police/settings/SettingsTabs';
import ProfilePictureCard from '../components/police/settings/ProfilePictureCard';
import ProfileEditForm from '../components/police/settings/ProfileEditForm';
import PasswordCard from '../components/police/settings/PasswordCard';
import { mockOfficerProfile } from '../data/settingsMockData';
import '../styles/police-dashboard.css';
import '../styles/settings.css';

/**
 * PoliceProfileSettingsPage — /police/settings/profile
 * Shows Profile Settings tab active with editable form and change password section.
 */
export const PoliceProfileSettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Pre-fill form from mock data
  const [formData, setFormData] = useState({
    displayName: mockOfficerProfile.displayName,
    username: mockOfficerProfile.username,
    email: mockOfficerProfile.email,
    role: mockOfficerProfile.role,
    badgeNumber: mockOfficerProfile.badgeNumber,
    rank: mockOfficerProfile.rank,
    policeStation: mockOfficerProfile.policeStation,
    phone: mockOfficerProfile.phone,
    joinedDate: mockOfficerProfile.joinedDate,
    status: mockOfficerProfile.status,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    // Frontend-only: navigate back to profile view
    navigate('/police/settings');
  };

  const handleCancel = () => {
    navigate('/police/settings');
  };

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

          {/* Tabs — Profile Settings tab will be active via NavLink */}
          <SettingsTabs />

          {/* Two-column: Picture | Form */}
          <div className="settings-edit-layout">
            <ProfilePictureCard name={formData.displayName} />
            <ProfileEditForm formData={formData} onChange={handleChange} />
          </div>

          {/* Change Password Section */}
          <PasswordCard />

          {/* Form Footer Actions */}
          <div className="settings-form-footer">
            <button className="btn-settings-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn-update-profile" onClick={handleUpdate}>
              <UserCheck size={14} />
              Update Profile
            </button>
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

export default PoliceProfileSettingsPage;
