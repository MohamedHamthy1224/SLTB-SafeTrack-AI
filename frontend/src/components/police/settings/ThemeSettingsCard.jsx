import React, { useState, useEffect, useCallback } from 'react';
import { Palette, Sun, Moon, Monitor, Check, ChevronDown, Loader2 } from 'lucide-react';
import { settingsService } from '../../../services/settingsService';
import { useTheme } from '../../../hooks/useTheme';
import '../../../styles/settings.css';

const THEME_OPTIONS = [
  { value: 'light',  label: 'Light',          icon: Sun },
  { value: 'dark',   label: 'Dark',           icon: Moon },
  { value: 'system', label: 'System Default', icon: Monitor },
];

/**
 * ThemeSettingsCard — the centered card on the Theme Settings page.
 * Includes a custom styled dropdown matching the reference.
 * Fully connected to Flask API and MySQL persistence.
 */
const ThemeSettingsCard = () => {
  const { themePreference, setThemePreference } = useTheme();

  const [savedTheme, setSavedTheme] = useState(themePreference || 'light');
  const [selected, setSelected] = useState(themePreference || 'light');
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchThemePreference = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await settingsService.getThemePreference();
      if (res && res.success && res.data) {
        const pref = res.data.themePreference || 'light';
        setSavedTheme(pref);
        setSelected(pref);
        setThemePreference(pref);
      }
    } catch (err) {
      console.error('[Police ThemeSettingsCard] fetch error:', err);
      setError(err?.message || 'Unable to load theme preference.');
    } finally {
      setIsLoading(false);
    }
  }, [setThemePreference]);

  useEffect(() => {
    fetchThemePreference();
  }, [fetchThemePreference]);

  const handleSelect = (val) => {
    setSelected(val);
    setThemePreference(val);
    setOpen(false);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    if (isSaving || isLoading) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await settingsService.updateThemePreference(selected);
      if (res && res.success && res.data) {
        const updatedPref = res.data.themePreference;
        setSavedTheme(updatedPref);
        setSelected(updatedPref);
        setThemePreference(updatedPref);

        setSuccessMessage('Theme preference updated successfully.');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        throw new Error(res?.message || 'Failed to update theme preference.');
      }
    } catch (err) {
      console.error('[Police ThemeSettingsCard] save error:', err);
      setError(err?.message || 'Unable to save theme preference.');
      setSelected(savedTheme);
      setThemePreference(savedTheme);
    } finally {
      setIsSaving(false);
    }
  };

  const current = THEME_OPTIONS.find((o) => o.value === selected) ?? THEME_OPTIONS[0];
  const CurrentIcon = current.icon;

  return (
    <div className="settings-theme-body">
      <div className="settings-theme-card">
        {/* Large icon */}
        <div className="settings-theme-icon-wrap">
          <Palette size={28} />
        </div>

        <h2 className="settings-theme-heading">Theme Settings</h2>
        <p className="settings-theme-desc">
          Customize the appearance of the application.
        </p>

        {error && (
          <div style={{ padding: '0.65rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem', width: '100%', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{ padding: '0.65rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '0.85rem', marginBottom: '1rem', width: '100%', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}

        {/* Theme Field */}
        <label className="settings-theme-field-label">Theme</label>
        <span className="settings-theme-field-hint">
          Choose your preferred application theme.
        </span>

        {/* Custom dropdown */}
        <div className="settings-theme-dropdown-wrapper">
          <button
            className={`settings-theme-dropdown-btn${open ? ' open' : ''}`}
            onClick={() => !isSaving && !isLoading && setOpen((v) => !v)}
            type="button"
            disabled={isSaving || isLoading}
          >
            <div className="settings-theme-dropdown-left">
              <CurrentIcon size={16} color="#64748b" />
              <span>{current.label}</span>
            </div>
            <ChevronDown
              size={16}
              color="#94a3b8"
              style={{
                transform: open ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.15s ease',
              }}
            />
          </button>

          {open && (
            <div className="settings-theme-menu">
              {THEME_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = opt.value === selected;
                return (
                  <div
                    key={opt.value}
                    className={`settings-theme-menu-item${isSelected ? ' selected' : ''}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <div className="settings-theme-menu-item-left">
                      <Icon size={16} />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check size={15} color="#0047ff" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button className="btn-save-theme" type="button" onClick={handleSave} disabled={isSaving || isLoading}>
          {isSaving ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Loader2 size={16} className="spinner" /> Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default ThemeSettingsCard;
