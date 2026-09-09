import React from 'react';
import { Info, Bus, Radio, Wifi, WifiOff } from 'lucide-react';
import '../../../styles/policeDeviceManagement.css';

const StatusPill = ({ status }) => {
  const cls = status?.toLowerCase() || 'inactive';
  return <span className={`badge-status ${cls}`}>{status || '—'}</span>;
};

const OnlinePill = ({ isOnline }) => {
  const online = Boolean(isOnline);
  return (
    <span className={`badge-online ${online ? 'online' : 'offline'}`}>
      {online ? <Wifi size={10} /> : <WifiOff size={10} />}
      {online ? 'Online' : 'Offline'}
    </span>
  );
};

export const DeviceDetails = ({ device }) => {
  if (!device) return null;

  const isBusUnit = (device.deviceType || device.device_type) === 'Bus Unit';
  const assignment = device.assignment || device.bus_device;

  const leftDeviceInfo = [
    { label: 'Device ID', value: device.deviceId || device.device_id },
    { label: 'Device Code', value: device.deviceCode || device.device_code, bold: true },
    { label: 'Device Name', value: device.deviceName || device.device_name },
    {
      label: 'Device Type',
      value: (
        <span className={`badge-device-type ${isBusUnit ? 'bus-unit' : 'roadside-unit'}`}>
          {isBusUnit ? <Bus size={11} /> : <Radio size={11} />}
          {device.deviceType || device.device_type}
        </span>
      ),
    },
    { label: 'MAC Address', value: device.macAddress || device.mac_address || '—', mono: true },
    { label: 'IP Address', value: device.ipAddress || device.ip_address || '—' },
  ];

  const rightDeviceInfo = [
    { label: 'Firmware Version', value: device.firmwareVersion || device.firmware_version || '—' },
    { label: 'Installation Date', value: device.installationDate || device.installation_date || '—' },
    { label: 'Last Seen', value: device.lastSeen || device.last_seen || '—' },
    {
      label: 'Online Status',
      value: <OnlinePill isOnline={device.isOnline !== undefined ? device.isOnline : device.is_online} />,
    },
    { label: 'Status', value: <StatusPill status={device.status} /> },
    { label: 'Created At', value: device.createdAt || device.created_at || '—' },
  ];

  return (
    <div className="device-details-wrapper">
      {/* Top Summary Strip */}
      <div className="device-top-summary-card">
        <div className="device-top-summary-grid">
          <div className="device-summary-item">
            <span className="device-summary-item-label">Device Code</span>
            <span className="device-summary-item-value">{device.deviceCode || device.device_code || '—'}</span>
          </div>
          <div className="device-summary-item">
            <span className="device-summary-item-label">Device Name</span>
            <span className="device-summary-item-value">{device.deviceName || device.device_name || '—'}</span>
          </div>
          <div className="device-summary-item">
            <span className="device-summary-item-label">Device Type</span>
            <span className="device-summary-item-value">{device.deviceType || device.device_type || '—'}</span>
          </div>
          <div className="device-summary-item">
            <span className="device-summary-item-label">Status</span>
            <StatusPill status={device.status} />
          </div>
          <div className="device-summary-item">
            <span className="device-summary-item-label">Online Status</span>
            <OnlinePill isOnline={device.isOnline !== undefined ? device.isOnline : device.is_online} />
          </div>
          <div className="device-summary-item">
            <span className="device-summary-item-label">Created At</span>
            <span className="device-summary-item-value" style={{ fontSize: '0.8rem' }}>
              {device.createdAt || device.created_at || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Device Information Card */}
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
            {leftDeviceInfo.map((row, idx) => (
              <div className="device-info-row" key={idx}>
                <span className="device-info-row-label">{row.label}</span>
                <span
                  className="device-info-row-value"
                  style={{
                    fontFamily: row.mono ? 'monospace' : 'inherit',
                    fontWeight: row.bold ? 700 : 'inherit',
                  }}
                >
                  {row.value ?? '—'}
                </span>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div>
            {rightDeviceInfo.map((row, idx) => (
              <div className="device-info-row" key={idx}>
                <span className="device-info-row-label">{row.label}</span>
                <span className="device-info-row-value">{row.value ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bus Device Assignment Section (Rendered only for Bus Unit) */}
      {isBusUnit && (
        <div className="device-info-card">
          <div className="device-info-card-header">
            <div className="device-info-card-icon" style={{ background: '#eff6ff', color: '#0047ff' }}>
              <Bus size={16} />
            </div>
            <h3 className="device-info-card-title">Bus Device Assignment</h3>
          </div>

          {assignment ? (
            <div className="device-info-rows-grid">
              <div>
                <div className="device-info-row">
                  <span className="device-info-row-label">Bus Device ID</span>
                  <span className="device-info-row-value">
                    {assignment.busDeviceId || assignment.bus_device_id || '—'}
                  </span>
                </div>
                <div className="device-info-row">
                  <span className="device-info-row-label">Assigned Bus</span>
                  <span className="device-info-row-value" style={{ fontWeight: 700, color: '#0047ff' }}>
                    {assignment.busNumber || assignment.bus_number || `Bus #${assignment.busId || assignment.bus_id}`}{' '}
                    {assignment.registrationNumber || assignment.registration_number
                      ? `(${assignment.registrationNumber || assignment.registration_number})`
                      : ''}
                  </span>
                </div>
                <div className="device-info-row">
                  <span className="device-info-row-label">Device ID</span>
                  <span className="device-info-row-value">
                    {assignment.deviceId || assignment.device_id || device.deviceId || device.device_id}
                  </span>
                </div>
              </div>

              <div>
                <div className="device-info-row">
                  <span className="device-info-row-label">Installation Location</span>
                  <span className="device-info-row-value">
                    {assignment.installationLocation || assignment.installation_location || '—'}
                  </span>
                </div>
                <div className="device-info-row">
                  <span className="device-info-row-label">Installed Date</span>
                  <span className="device-info-row-value">
                    {assignment.installedDate || assignment.installed_date || '—'}
                  </span>
                </div>
                <div className="device-info-row">
                  <span className="device-info-row-label">Assignment Status</span>
                  <span className="device-info-row-value">
                    <StatusPill status={assignment.status} />
                  </span>
                </div>
                <div className="device-info-row">
                  <span className="device-info-row-label">Assigned At</span>
                  <span className="device-info-row-value">
                    {assignment.createdAt || assignment.created_at || '—'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
              No bus assignment record found for this Bus Unit device.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceDetails;
