import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Square, Wifi, WifiOff, AlertOctagon, Bus, Radio } from 'lucide-react';
import '../../../styles/policeDeviceManagement.css';

const OnlineBadge = ({ isOnline }) => {
  const online = Boolean(isOnline);
  return (
    <span className={`badge-online ${online ? 'online' : 'offline'}`}>
      {online ? <Wifi size={10} /> : <WifiOff size={10} />}
      {online ? 'Online' : 'Offline'}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const cls = status?.toLowerCase() || 'inactive';
  return <span className={`badge-status ${cls}`}>{status || 'Inactive'}</span>;
};

const DeviceTypeBadge = ({ deviceType }) => {
  const isBus = deviceType === 'Bus Unit';
  return (
    <span className={`badge-device-type ${isBus ? 'bus-unit' : 'roadside-unit'}`}>
      {isBus ? <Bus size={11} /> : <Radio size={11} />}
      {deviceType}
    </span>
  );
};

const StopConfirmModal = ({ device, onConfirm, onCancel, isSubmitting }) => (
  <div className="device-modal-overlay">
    <div className="device-modal-box">
      <div className="modal-icon-wrapper">
        <AlertOctagon size={24} />
      </div>
      <h3 className="modal-title">Deactivate Device?</h3>
      <p className="modal-desc">
        Are you sure you want to change the status of{' '}
        <strong>{device?.deviceName}</strong> ({device?.deviceCode}) to{' '}
        <span style={{ color: '#64748b', fontWeight: 700 }}>Inactive</span>?
        The device will remain in the database.
      </p>
      <div className="modal-btn-group">
        <button className="btn-modal-cancel" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button className="btn-modal-confirm" onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Set Inactive'}
        </button>
      </div>
    </div>
  </div>
);

export const DeviceTable = ({ devices = [], loading = false, onSetInactive }) => {
  const navigate = useNavigate();
  const [stopTarget, setStopTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleView = (deviceId) => {
    navigate(`/police/device-management/${deviceId}`);
  };

  const handleEdit = (deviceId) => {
    navigate(`/police/device-management/edit/${deviceId}`);
  };

  const handleConfirmStop = async () => {
    if (!stopTarget) return;
    try {
      setIsSubmitting(true);
      await onSetInactive(stopTarget.deviceId || stopTarget.device_id);
      setStopTarget(null);
    } catch (err) {
      console.error("Failed to deactivate device:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="device-table-card">
        <h3 className="device-table-card-title">All Devices</h3>
        <div className="device-table-wrapper">
          <table className="device-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Device Code</th>
                <th>Device Name</th>
                <th>Device Type</th>
                <th>MAC Address</th>
                <th>IP Address</th>
                <th>Firmware Version</th>
                <th>Installation Date</th>
                <th>Last Seen</th>
                <th>Online Status</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={13} style={{ textAlign: 'center', color: '#64748b', padding: '2.5rem' }}>
                    Loading devices...
                  </td>
                </tr>
              )}
              {!loading && devices.length === 0 && (
                <tr>
                  <td colSpan={13} style={{ textAlign: 'center', color: '#94a3b8', padding: '2.5rem' }}>
                    No devices found matching the selected criteria.
                  </td>
                </tr>
              )}
              {!loading &&
                devices.map((device) => {
                  const id = device.deviceId || device.device_id;
                  const isAlreadyInactive = device.status === 'Inactive';

                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td><strong>{device.deviceCode || device.device_code}</strong></td>
                      <td>{device.deviceName || device.device_name}</td>
                      <td><DeviceTypeBadge deviceType={device.deviceType || device.device_type} /></td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.775rem' }}>
                        {device.macAddress || device.mac_address || '—'}
                      </td>
                      <td>{device.ipAddress || device.ip_address || '—'}</td>
                      <td>{device.firmwareVersion || device.firmware_version || '—'}</td>
                      <td>{device.installationDate || device.installation_date || '—'}</td>
                      <td>{device.lastSeen || device.last_seen || '—'}</td>
                      <td>
                        <OnlineBadge isOnline={device.isOnline !== undefined ? device.isOnline : device.is_online} />
                      </td>
                      <td><StatusBadge status={device.status} /></td>
                      <td>{device.createdAt || device.created_at || '—'}</td>
                      <td>
                        <div className="device-action-group">
                          {/* Eye View Icon */}
                          <button
                            className="btn-action-icon view"
                            title="View Details"
                            onClick={() => handleView(id)}
                          >
                            <Eye size={13} />
                          </button>
                          {/* Pencil Edit Icon */}
                          <button
                            className="btn-action-icon edit"
                            title="Edit Device"
                            onClick={() => handleEdit(id)}
                          >
                            <Pencil size={12} />
                          </button>
                          {/* Stop Icon */}
                          <button
                            className="btn-action-icon stop"
                            title={isAlreadyInactive ? "Device is Inactive" : "Set Status Inactive"}
                            onClick={() => setStopTarget(device)}
                            disabled={isAlreadyInactive}
                            style={isAlreadyInactive ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                          >
                            <Square size={11} fill={isAlreadyInactive ? '#94a3b8' : 'currentColor'} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {stopTarget && (
        <StopConfirmModal
          device={stopTarget}
          onConfirm={handleConfirmStop}
          onCancel={() => setStopTarget(null)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default DeviceTable;
