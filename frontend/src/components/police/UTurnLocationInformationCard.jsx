import React from 'react';
import { MapPin, Navigation, Globe, Milestone, Compass, Map } from 'lucide-react';
import '../../styles/viewUTurnAlert.css';

const locationFields = [
  { label: 'Location Name', key: 'locationName', icon: MapPin },
  { label: 'Latitude', key: 'latitude', icon: Navigation },
  { label: 'Longitude', key: 'longitude', icon: Navigation },
  { label: 'City', key: 'city', icon: Globe },
  { label: 'Province', key: 'province', icon: Milestone },
  { label: 'Road Name', key: 'roadName', icon: Compass },
  { label: 'Direction', key: 'direction', icon: Map },
  { label: 'Speed Zone', key: 'speedZone', icon: Milestone },
];

const UTurnLocationInformationCard = ({ location }) => {
  if (!location) return null;

  return (
    <div className="uturn-details-card">
      <h4 className="uturn-card-title">Location Information</h4>
      <div className="location-info-grid">
        {locationFields.map(({ label, key, icon: Icon }) => {
          const value = location[key] ?? '—';
          return (
            <div className="location-info-item" key={key}>
              <div className="location-item-label">
                <Icon size={13} color="#0047ff" />
                <span>{label}</span>
              </div>
              <div className="location-item-value">{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UTurnLocationInformationCard;
