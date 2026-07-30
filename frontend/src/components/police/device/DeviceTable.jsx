import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import '../../../styles/deviceManagement.css';

const OnlineBadge = ({ status }) => {
  const isOnline = status === 'Online';
  return (
    <span className={`badge-online ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
      {status}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const cls = status?.toLowerCase() || 'inactive';
  return <span className={`badge-status ${cls}`}>{status}</span>;
};

const DeleteModal = ({ device, onConfirm, onCancel }) => (
  <div className="device-modal-overlay">
    <div className="device-modal-box">
      <div className="modal-icon-wrapper">
        <AlertTriangle size={24} />
      </div>
      <h3 className="modal-title">Delete Device?</h3>
      <p className="modal-desc">
        Are you sure you want to delete <strong>{device?.deviceName}</strong> ({device?.deviceCode})? This action cannot be undone.
      </p>
      <div className="modal-btn-group">
        <button className="btn-modal-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn-modal-delete" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

const DeviceTable = ({ devices }) => {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleView = (device) => {
    navigate(`/police/device-management/${device.id}`, { state: { device } });
  };

  const handleEdit = (device) => {
    navigate(`/police/device-management/${device.id}/edit`, { state: { device } });
  };

  const handleDeleteConfirm = () => {
    // Frontend-only: dismiss modal (no backend call)
    setDeleteTarget(null);
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
              {devices.length === 0 && (
                <tr>
                  <td colSpan={13} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                    No devices found for the selected filters.
                  </td>
                </tr>
              )}
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>{device.deviceId}</td>
                  <td>{device.deviceCode}</td>
                  <td>{device.deviceName}</td>
                  <td>{device.deviceType}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.775rem' }}>{device.macAddress}</td>
                  <td>{device.ipAddress}</td>
                  <td>{device.firmwareVersion}</td>
                  <td>{device.installationDate}</td>
                  <td>{device.lastSeen}</td>
                  <td><OnlineBadge status={device.isOnline} /></td>
                  <td><StatusBadge status={device.status} /></td>
                  <td>{device.createdAt}</td>
                  <td>
                    <div className="device-action-group">
                      <button
                        className="btn-action-icon view"
                        title="View Device"
                        onClick={() => handleView(device)}
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        className="btn-action-icon edit"
                        title="Edit Device"
                        onClick={() => handleEdit(device)}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        className="btn-action-icon delete"
                        title="Delete Device"
                        onClick={() => setDeleteTarget(device)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <DeleteModal
          device={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
};

export default DeviceTable;
