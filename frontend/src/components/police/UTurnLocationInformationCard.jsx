import React from 'react';
import { MapPin, Navigation, Calendar, Activity, Cpu, Route as RouteIcon, Clock } from 'lucide-react';
import '../../styles/viewUTurnAlert.css';

const locationFields = [
  { label: 'Location Name', getVal: (loc) => loc.locationName ?? loc.location_name, icon: MapPin },
  { label: 'Latitude', getVal: (loc) => loc.latitude, icon: Navigation },
  { label: 'Longitude', getVal: (loc) => loc.longitude, icon: Navigation },
  { label: 'Unit Status', getVal: (loc) => loc.status, icon: Activity },
  { label: 'Installation Date', getVal: (loc) => loc.installationDate ?? loc.installation_date, icon: Calendar },
  { label: 'Roadside Device ID', getVal: (loc) => loc.deviceId ?? loc.device_id, icon: Cpu },
  { label: 'Route ID', getVal: (loc) => loc.routeId ?? loc.route_id, icon: RouteIcon },
  { label: 'Registered At', getVal: (loc) => loc.createdAt ?? loc.created_at, icon: Clock },
];

const UTurnLocationInformationCard = ({ location }) => {
  if (!location) {
    return (
      <div className="uturn-details-card">
        <h4 className="uturn-card-title">Roadside Unit Location</h4>
        <div style={{ color: '#64748b', fontSize: '0.85rem', padding: '1rem 0' }}>
          No roadside unit location data linked to this alert.
        </div>
      </div>
    );
  }

  return (
    <div className="uturn-details-card">
      <h4 className="uturn-card-title">Roadside Unit Location</h4>
      <div className="location-info-grid">
        {locationFields.map(({ label, getVal, icon: Icon }) => {
          const rawVal = getVal(location);
          const value = rawVal !== null && rawVal !== undefined && rawVal !== '' ? String(rawVal) : '—';

          return (
            <div className="location-info-item" key={label}>
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
