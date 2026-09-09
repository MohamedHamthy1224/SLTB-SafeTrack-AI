import React from 'react';
import { Eye } from 'lucide-react';
import '../../../styles/view-bus-alert.css';

export const AlertDetailsCard = ({ alertData }) => {
  const alert = alertData || {};

  const getPriorityBadgeClass = (priority) => {
    switch (String(priority || '').toLowerCase()) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'low';
    }
  };

  return (
    <div className="details-card">
      <h3 className="details-card-title">Alert Details</h3>

      <div className="details-table-list">
        <div className="details-row">
          <span className="details-label">Bus Alert ID</span>
          <span className="details-value">{alert.busAlertId || alert.id || '—'}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Bus ID</span>
          <span className="details-value">{alert.busId || '—'}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Device ID</span>
          <span className="details-value">{alert.deviceId || '—'}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Assignment ID</span>
          <span className="details-value">{alert.assignmentId || '—'}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Sensor Data ID</span>
          <span className="details-value">{alert.sensorDataId || '—'}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Alert Time</span>
          <span className="details-value">{alert.alertTime || '—'}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Notification Title</span>
          <span className="details-value" style={{ color: '#0F172A', fontWeight: 800 }}>{alert.notificationTitle || '—'}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Priority</span>
          <span className="details-value">
            {alert.priority ? (
              <span className={`priority-badge ${getPriorityBadgeClass(alert.priority)}`}>
                {alert.priority}
              </span>
            ) : '—'}
          </span>
        </div>

        <div className="details-row">
          <span className="details-label">Created At</span>
          <span className="details-value">{alert.createdAt || '—'}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Actions</span>
          <span className="details-value">
            <span className="action-view-only">
              <Eye size={15} />
              <span>View Only</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsCard;
