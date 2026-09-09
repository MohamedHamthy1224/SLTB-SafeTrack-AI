import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Loader2 } from 'lucide-react';
import { PoliceSidebar } from '../components/police/PoliceSidebar';
import { PoliceDashboardHeader } from '../components/police/PoliceDashboardHeader';
import SettingsTabs from '../components/police/settings/SettingsTabs';
import ProfileViewCard from '../components/police/settings/ProfileViewCard';
import ProfileInformationCard from '../components/police/settings/ProfileInformationCard';
import OfficerInformationCard from '../components/police/settings/OfficerInformationCard';
import { profileService } from '../services/profileService';
import '../styles/police-dashboard.css';
import '../styles/settings.css';

/**
 * PoliceSettingsPage — /police/settings
 * Shows the View Profile tab content (read-only profile view).
 */
export const PoliceSettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await profileService.getProfile();
        if (isMounted) {
          if (res && res.success && res.data) {
            setProfile(res.data);
          } else {
            setError(res?.message || 'Unable to load profile information.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('[PoliceSettingsPage] error:', err);
          setError(err?.message || 'Unable to connect to server. Please check your connection.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

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

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', color: '#64748b' }}>
              <Loader2 size={32} className="spinner" style={{ marginBottom: '0.75rem' }} />
              <p>Loading profile information...</p>
            </div>
          ) : error ? (
            <div className="settings-profile-grid" style={{ color: '#ef4444', textAlign: 'center', padding: '2rem', background: '#ffffff', borderRadius: '12px' }}>
              <p>{error}</p>
            </div>
          ) : (
            /* Three-column layout */
            <div className="settings-profile-grid">
              <ProfileViewCard profile={profile || {}} />
              <ProfileInformationCard profile={profile || {}} />
              <OfficerInformationCard />
            </div>
          )}

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
