import React from 'react';
import {
  Hash,
  Cpu,
  Monitor,
  Route as RouteIcon,
  Activity,
  Clock,
  Bell,
  Flag,
  Calendar,
} from 'lucide-react';
import '../../styles/viewUTurnAlert.css';

const fieldRows = [
  { label: 'Roadside Alert ID', getVal: (a) => a.roadsideAlertId ?? a.roadside_alert_id, icon: Hash },
  { label: 'Roadside Unit ID', getVal: (a) => a.roadsideUnitId ?? a.roadside_unit_id, icon: Cpu },
  { label: 'Device ID', getVal: (a) => a.deviceId ?? a.device_id, icon: Monitor },
  { label: 'Route ID', getVal: (a) => a.routeId ?? a.route_id, icon: RouteIcon },
  { label: 'Sensor Data ID', getVal: (a) => a.sensorDataId ?? a.sensor_data_id, icon: Activity },
  { label: 'Alert Time', getVal: (a) => a.alertTime ?? a.alert_time, icon: Clock },
  { label: 'Notification Title', getVal: (a) => a.notificationTitle ?? a.notification_title, icon: Bell },
  { label: 'Priority', getVal: (a) => a.priority, icon: Flag },
  { label: 'Recorded Time', getVal: (a) => a.alertTime ?? a.alert_time ?? a.createdAt ?? a.created_at, icon: Calendar },
];

const priorityColors = {
  High: { bg: '#FEF2F2', color: '#EF4444' },
  Medium: { bg: '#FFF7ED', color: '#F97316' },
  Low: { bg: '#F0FDF4', color: '#10B981' },
};

const UTurnAlertDetailsCard = ({ alert }) => {
  if (!alert) {
    return (
      <div className="uturn-details-card">
        <h4 className="uturn-card-title">Alert Details</h4>
        <div style={{ color: '#64748b', fontSize: '0.85rem', padding: '1rem 0' }}>
          No alert details available.
        </div>
      </div>
    );
  }

  return (
    <div className="uturn-details-card">
      <h4 className="uturn-card-title">Alert Details</h4>
      <div className="uturn-details-list">
        {fieldRows.map(({ label, getVal, icon: Icon }) => {
          const rawValue = getVal(alert);
          const value = rawValue !== null && rawValue !== undefined && rawValue !== '' ? String(rawValue) : '—';

          if (label === 'Priority') {
            const pStyle = priorityColors[value] || { bg: '#f8fafc', color: '#64748b' };
            return (
              <div className="uturn-details-row" key={label}>
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
            <div className="uturn-details-row" key={label}>
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
