import React from 'react';
import '../../../styles/viewDevice.css';

/**
 * DeviceTopSummaryCard — horizontal strip at top of View Device page.
 * Shows: Device Code, Device Name, Device Type, Status, Online Status, Created At
 */

const StatusBadge = ({ value, type }) => {
  if (type === 'online') {
    const isOnline = value === 'Online' || value === 'Yes';
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.2rem 0.65rem',
          borderRadius: '20px',
          fontSize: '0.775rem',
          fontWeight: 700,
          background: isOnline ? '#dcfce7' : '#fee2e2',
          color: isOnline ? '#16a34a' : '#dc2626',
        }}
      >
        {isOnline ? 'Online' : 'Offline'}
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
          alignItems: 'center',
          padding: '0.2rem 0.65rem',
          borderRadius: '20px',
          fontSize: '0.775rem',
          fontWeight: 700,
          background: style.bg,
          color: style.color,
        }}
      >
        {value}
      </span>
    );
  }
  return <span>{value}</span>;
};

const DeviceTopSummaryCard = ({ device }) => {
  if (!device) return null;

  return (
    <div className="device-top-summary-card">
      <div className="device-top-summary-grid">
        <div className="device-summary-item">
          <span className="device-summary-item-label">Device Code</span>
          <span className="device-summary-item-value">{device.deviceCode || '—'}</span>
        </div>
        <div className="device-summary-item">
          <span className="device-summary-item-label">Device Name</span>
          <span className="device-summary-item-value">{device.deviceName || '—'}</span>
        </div>
        <div className="device-summary-item">
          <span className="device-summary-item-label">Device Type</span>
          <span className="device-summary-item-value">{device.deviceType || '—'}</span>
        </div>
        <div className="device-summary-item">
          <span className="device-summary-item-label">Status</span>
          <StatusBadge value={device.status} type="status" />
        </div>
        <div className="device-summary-item">
          <span className="device-summary-item-label">Online Status</span>
          <StatusBadge value={device.isOnline} type="online" />
        </div>
        <div className="device-summary-item">
          <span className="device-summary-item-label">Created At</span>
          <span className="device-summary-item-value" style={{ fontSize: '0.82rem' }}>
            {device.createdAt || '—'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeviceTopSummaryCard;
