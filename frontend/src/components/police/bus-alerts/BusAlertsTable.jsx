import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../../styles/bus-alerts.css';

export const BusAlertsTable = ({ alerts = [], currentPage = 1, onPageChange }) => {
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const totalItems = alerts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentAlerts = alerts.slice(startIndex, endIndex);

  const handleViewAlert = (alertItem) => {
    const targetId = alertItem.id || alertItem.busAlertId || alertItem.bus_alert_id;
    navigate(`/police/bus-alerts/${targetId}`, {
      state: { alert: alertItem }
    });
  };

  const getPriorityBadgeClass = (priority) => {
    switch (String(priority).toLowerCase()) {
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
    <div className="bus-alerts-table-card">
      <h3 className="table-card-title">All Bus Alerts</h3>

      <div className="table-wrapper">
        <table className="bus-alerts-table">
          <thead>
            <tr>
              <th>Bus Alert ID</th>
              <th>Bus ID</th>
              <th>Device ID</th>
              <th>Assignment ID</th>
              <th>Sensor Data ID</th>
              <th>Alert Time</th>
              <th>Notification Title</th>
              <th>Priority</th>
              <th>Created At</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAlerts.length > 0 ? (
              currentAlerts.map((item) => (
                <tr key={item.id || item.busAlertId || item.bus_alert_id}>
                  <td><strong>{item.busAlertId || item.id}</strong></td>
                  <td>{item.busNumber ? `${item.busNumber} (${item.busId})` : item.busId}</td>
                  <td>{item.deviceId}</td>
                  <td>{item.assignmentId || '—'}</td>
                  <td>{item.sensorDataId || '—'}</td>
                  <td>{item.alertTime}</td>
                  <td style={{ fontWeight: 600 }}>{item.notificationTitle || item.notification_title || 'Bus Alert'}</td>
                  <td>
                    <span className={`priority-badge ${getPriorityBadgeClass(item.priority)}`}>
                      {item.priority || 'Medium'}
                    </span>
                  </td>
                  <td>{item.createdAt || item.alertTime}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn-action-eye"
                      title="View Bus Alert Details"
                      onClick={() => handleViewAlert(item)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No bus alerts found matching the selected filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dynamic Pagination Footer */}
      <div className="table-pagination-bar">
        <div className="pagination-info">
          {totalItems > 0 ? (
            `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} alerts`
          ) : (
            'Showing 0 to 0 of 0 alerts'
          )}
        </div>

        <div className="pagination-controls">
          <button 
            className="pagination-btn" 
            onClick={() => onPageChange && onPageChange(Math.max(1, validPage - 1))}
            disabled={validPage <= 1}
          >
            <ChevronLeft size={16} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`pagination-btn ${validPage === p ? 'active' : ''}`}
              onClick={() => onPageChange && onPageChange(p)}
            >
              {p}
            </button>
          ))}

          <button 
            className="pagination-btn" 
            onClick={() => onPageChange && onPageChange(Math.min(totalPages, validPage + 1))}
            disabled={validPage >= totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusAlertsTable;
