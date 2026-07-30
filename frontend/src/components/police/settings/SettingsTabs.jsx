import React from 'react';
import { NavLink } from 'react-router-dom';
import { Palette, User } from 'lucide-react';
import '../../../styles/settings.css';

/**
 * SettingsTabs — top navigation tabs shared across all settings pages.
 * Uses NavLink so the active tab is automatically driven by the current route.
 */
const SettingsTabs = () => {
  return (
    <div className="settings-tabs-card">
      <NavLink
        to="/police/settings/theme"
        end={false}
        className={({ isActive }) =>
          `settings-tab${isActive ? ' active' : ''}`
        }
      >
        <Palette size={16} />
        Theme Settings
      </NavLink>

      <NavLink
        to="/police/settings/profile"
        end={false}
        className={({ isActive }) =>
          `settings-tab${isActive ? ' active' : ''}`
        }
      >
        <User size={16} />
        Profile Settings
      </NavLink>
    </div>
  );
};

export default SettingsTabs;
