import React from 'react';
import { Info } from 'lucide-react';
import '../../../styles/settings.css';

/**
 * OfficerInformationCard — right mini-card on the View Profile page.
 * Shows account info description with an info icon.
 */
const OfficerInformationCard = () => {
  return (
    <div className="settings-profile-right-card">
      <div className="settings-info-card-icon">
        <Info size={18} />
      </div>
      <h4 className="settings-info-card-title">Account Info</h4>
      <p className="settings-info-card-text">
        Keep your profile information up to date for secure and accurate access
        to SLTB SafeTrack AI.
      </p>
    </div>
  );
};

export default OfficerInformationCard;
