import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ThemeSettingsCard } from '../components/settings/ThemeSettingsCard';
import { settingsService } from '../services/settingsService';
import { useTheme } from '../hooks/useTheme';
import '../styles/settings.css';

export const SettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { themePreference, setThemePreference } = useTheme();

  const [savedThemePreference, setSavedThemePreference] = useState(themePreference || 'light');
  const [selectedThemePreference, setSelectedThemePreference] = useState(themePreference || 'light');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch initial saved theme preference from Flask backend
  const fetchThemePreference = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await settingsService.getThemePreference();
      if (res && res.success && res.data) {
        const pref = res.data.themePreference || 'light';
        setSavedThemePreference(pref);
        setSelectedThemePreference(pref);
        setThemePreference(pref);
      }
    } catch (err) {
      console.error('[SettingsPage] Error fetching theme preference:', err);
      setError(err?.response?.data?.message || err?.message || 'Unable to load theme preference.');
    } finally {
      setIsLoading(false);
    }
  }, [setThemePreference]);

  useEffect(() => {
    fetchThemePreference();
  }, [fetchThemePreference]);

  // Handle dropdown selection (Live Preview before Save)
  const handleThemeChange = (newTheme) => {
    setSelectedThemePreference(newTheme);
    setThemePreference(newTheme);
  };

  // Handle Save Changes button click
  const handleSaveTheme = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await settingsService.updateThemePreference(selectedThemePreference);
      if (res && res.success && res.data) {
        const updatedPref = res.data.themePreference;
        setSavedThemePreference(updatedPref);
        setSelectedThemePreference(updatedPref);
        setThemePreference(updatedPref);

        setSuccessMessage('Theme preference updated successfully.');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        throw new Error(res?.message || 'Failed to update theme preference.');
      }
    } catch (err) {
      console.error('[SettingsPage] Save error:', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Unable to save theme preference.';
      setError(errMsg);

      // Restore saved database theme preference on failure
      setSelectedThemePreference(savedThemePreference);
      setThemePreference(savedThemePreference);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} subtitle="System Settings & Preferences" />

        <div className="dashboard-content">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb-row" style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 500 }}>Home</span> &gt; <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Settings</span>
          </div>

          <div className="settings-content-wrapper">
            <ThemeSettingsCard
              selectedTheme={selectedThemePreference}
              onThemeChange={handleThemeChange}
              onSave={handleSaveTheme}
              isSaving={isSaving}
              isLoading={isLoading}
              error={error}
              successMessage={successMessage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
