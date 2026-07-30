import React from 'react';
import { Info } from 'lucide-react';
import '../../../styles/viewDevice.css';

/**
 * DeviceInformationCard — two-column row-grid showing all device fields.
 * Matches Image 3 reference design.
 */

const InlineBadge = ({ value, type }) => {
  if (type === 'online') {
    const isYes = value === 'Online' || value === true || value === 'Yes';
    return (
      <span
        style={{
          display: 'inline-flex',
          padding: '0.18rem 0.6rem',
          borderRadius: '20px',
          fontSize: '0.72rem',
          fontWeight: 700,
          background: isYes ? '#dcfce7' : '#fee2e2',
          color: isYes ? '#16a34a' : '#dc2626',
        }}
      >
        {isYes ? 'Yes' : 'No'}
      </span>
    );
  }
  if (type === 'status') {
    const colors = {
      Active: { bg: '#dcfce7', color: '#16a34a' },
      Maintenance: { bg: '#fff7ed', color: '#ea580c' },
      Inactive: { bg: '#f1f5f9', color: '#64748b' },
    };
    const style = colors[value] || colors.Inactive;
    return (
      <span
        style={{
          display: 'inline-flex',
          padding: '0.18rem 0.6rem',
          borderRadius: '20px',
          fontSize: '0.72rem',
          fontWeight: 700,
          background: style.bg,
          color: style.color,
        }}
      >
        {value}
      </span>
    );
  }
  return null;
};

const leftRows = [
  { label: 'Device ID', key: 'id' },
  { label: 'Device Code', key: 'deviceCode' },
  { label: 'Device Name', key: 'deviceName' },
  { label: 'Device Type', key: 'deviceType' },
  { label: 'MAC Address', key: 'macAddress', mono: true },
  { label: 'IP Address', key: 'ipAddress' },
];

const rightRows = [
  { label: 'Firmware Version', key: 'firmwareVersion' },
  { label: 'Installation Date', key: 'installationDate' },
  { label: 'Last Seen', key: 'lastSeen' },
  { label: 'Is Online', key: 'isOnline', badge: 'online' },
  { label: 'Status', key: 'status', badge: 'status' },
  { label: 'Created At', key: 'createdAt' },
];

const DeviceInformationCard = ({ device }) => {
  if (!device) return null;

  const renderValue = (row) => {
    const val = device[row.key] ?? '—';
    if (row.badge) return <InlineBadge value={val} type={row.badge} />;
    if (row.mono) return <span style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{val}</span>;
    return val;
  };

  return (
    <div className="device-info-card">
      <div className="device-info-card-header">
        <div className="device-info-card-icon">
          <Info size={16} />
        </div>
        <h3 className="device-info-card-title">Device Information</h3>
      </div>

      <div className="device-info-rows-grid">
        {/* Left Column */}
        <div>
          {leftRows.map((row) => (
            <div className="device-info-row" key={row.key}>
              <div className="device-info-row-label">{row.label}</div>
              <div className="device-info-row-value">{renderValue(row)}</div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div style={{ borderLeft: '1px solid #f1f5f9' }}>
          {rightRows.map((row) => (
            <div className="device-info-row" key={row.key}>
              <div className="device-info-row-label">{row.label}</div>
              <div className="device-info-row-value">{renderValue(row)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceInformationCard;
