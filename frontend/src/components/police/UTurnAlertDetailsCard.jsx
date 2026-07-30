import React from 'react';
import {
  Hash,
  Cpu,
  Monitor,
  RouteIcon,
  Activity,
  Clock,
  Bell,
  Flag,
  Calendar,
} from 'lucide-react';
import '../../styles/viewUTurnAlert.css';

const fieldRows = [
  { label: 'Roadside Alert ID', key: 'roadsideAlertId', icon: Hash },
  { label: 'Roadside Unit ID', key: 'roadsideUnitId', icon: Cpu },
  { label: 'Device ID', key: 'deviceId', icon: Monitor },
  { label: 'Route ID', key: 'routeId', icon: RouteIcon },
  { label: 'Sensor Data ID', key: 'sensorDataId', icon: Activity },
  { label: 'Alert Time', key: 'alertTime', icon: Clock },
  { label: 'Notification Title', key: 'notificationTitle', icon: Bell },
  { label: 'Priority', key: 'priority', icon: Flag },
  { label: 'Created At', key: 'createdAt', icon: Calendar },
];

const priorityColors = {
  High: { bg: '#FEF2F2', color: '#EF4444' },
  Medium: { bg: '#FFF7ED', color: '#F97316' },
  Low: { bg: '#F0FDF4', color: '#10B981' },
};

const UTurnAlertDetailsCard = ({ alert }) => {
  if (!alert) return null;

  return (
    <div className="uturn-details-card">
      <h4 className="uturn-card-title">Alert Details</h4>
      <div className="uturn-details-list">
        {fieldRows.map(({ label, key, icon: Icon }) => {
          const value = alert[key] ?? '—';
          if (key === 'priority') {
            const pStyle = priorityColors[value] || { bg: '#f8fafc', color: '#64748b' };
            return (
              <div className="uturn-details-row" key={key}>
                <div className="uturn-label-group">
                  <span className="uturn-label-icon"><Icon size={14} /></span>
                  <span>{label}</span>
                </div>
                <span
                  className="priority-badge"
                  style={{
                    background: pStyle.bg,
                    color: pStyle.color,
                    border: `1px solid ${pStyle.color}33`,
                  }}
                >
                  {value}
                </span>
              </div>
            );
          }
          return (
            <div className="uturn-details-row" key={key}>
              <div className="uturn-label-group">
                <span className="uturn-label-icon"><Icon size={14} /></span>
                <span>{label}</span>
              </div>
              <span className="uturn-details-value">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UTurnAlertDetailsCard;
