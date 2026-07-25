import React from 'react';
import { Palette, Loader2 } from 'lucide-react';
import { ThemeSelect } from './ThemeSelect';

export const ThemeSettingsCard = ({
  selectedTheme,
  onThemeChange,
  onSave,
  isSaving,
  isLoading,
  error,
  successMessage
}) => {
  return (
    <div className="section-card theme-settings-card">
      <div className="theme-card-header">
        <div className="theme-card-icon-box">
          <Palette size={24} />
        </div>
        <div>
          <h3 className="theme-card-title">Theme Settings</h3>
          <p className="theme-card-subtitle">Customize the appearance of the application.</p>
        </div>
      </div>

      <div className="theme-card-body">
        {error && (
          <div className="alert-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert-success" style={{ marginBottom: '1rem' }}>
            {successMessage}
          </div>
        )}

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', display: 'block' }}>
            Theme
          </label>
          <p className="form-helper-text" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Choose your preferred application theme.
          </p>

          <ThemeSelect
            value={selectedTheme}
            onChange={onThemeChange}
            disabled={isLoading || isSaving}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1.75rem' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={onSave}
            disabled={isLoading || isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.75rem',
              borderRadius: '8px',
              backgroundColor: '#0240bf',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: 'none',
              cursor: isLoading || isSaving ? 'not-allowed' : 'pointer',
              opacity: isLoading || isSaving ? 0.75 : 1
            }}
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsCard;
