import React from 'react';
import { Sun } from 'lucide-react';
import '../../../styles/settings.css';

/**
 * ProfileInformationCard — center card on the View Profile page.
 * Shows Account Information and Police Officer Information tables.
 */
const ProfileInformationCard = ({ profile }) => {
  return (
    <div className="settings-profile-center-card">
      {/* Account Information */}
      <h3 className="settings-info-section-title">Account Information</h3>
      <table className="settings-info-table">
        <tbody>
          <tr>
            <td>Username</td>
            <td>{profile.username}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{profile.email}</td>
          </tr>
          <tr>
            <td>Role</td>
            <td>{profile.role}</td>
          </tr>
          <tr>
            <td>Theme Preference</td>
            <td>
              <span className="badge-theme-light">
                <Sun size={11} />
                {profile.themePreference}
              </span>
            </td>
          </tr>
          <tr>
            <td>Status</td>
            <td>
              <span className="badge-active">{profile.status}</span>
            </td>
          </tr>
          <tr>
            <td>Account Created</td>
            <td>{profile.accountCreated}</td>
          </tr>
          <tr>
            <td>Last Updated</td>
            <td>{profile.lastUpdated}</td>
          </tr>
        </tbody>
      </table>

      {/* Police Officer Information */}
      <h3 className="settings-info-section-title" style={{ marginTop: '1.5rem' }}>
        Police Officer Information
      </h3>
      <table className="settings-info-table">
        <tbody>
          <tr>
            <td>Full Name</td>
            <td>{profile.fullName}</td>
          </tr>
          <tr>
            <td>Badge Number</td>
            <td>{profile.badgeNumber}</td>
          </tr>
          <tr>
            <td>Rank</td>
            <td>{profile.rank}</td>
          </tr>
          <tr>
            <td>Police Station</td>
            <td>{profile.policeStation}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{profile.phone}</td>
          </tr>
          <tr>
            <td>Joined Date</td>
            <td>{profile.joinedDate}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProfileInformationCard;
