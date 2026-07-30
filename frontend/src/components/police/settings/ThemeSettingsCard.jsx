import React, { useState } from 'react';
import { Palette, Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';
import '../../../styles/settings.css';

const THEME_OPTIONS = [
  { value: 'light',  label: 'Light',          icon: Sun },
  { value: 'dark',   label: 'Dark',           icon: Moon },
  { value: 'system', label: 'System Default', icon: Monitor },
];

/**
 * ThemeSettingsCard — the centered card on the Theme Settings page.
 * Includes a custom styled dropdown matching the reference.
 * Frontend-only: no actual theme switching.
 */
const ThemeSettingsCard = () => {
  const [selected, setSelected] = useState('light');
  const [open, setOpen] = useState(false);

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

        {/* Theme Field */}
        <label className="settings-theme-field-label">Theme</label>
        <span className="settings-theme-field-hint">
          Choose your preferred application theme.
        </span>

        {/* Custom dropdown */}
        <div className="settings-theme-dropdown-wrapper">
          <button
            className={`settings-theme-dropdown-btn${open ? ' open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            type="button"
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
                    onClick={() => {
                      setSelected(opt.value);
                      setOpen(false);
                    }}
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

        <button className="btn-save-theme" onClick={() => setOpen(false)}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ThemeSettingsCard;
