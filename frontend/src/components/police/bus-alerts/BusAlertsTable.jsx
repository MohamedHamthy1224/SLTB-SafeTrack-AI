import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../../styles/bus-alerts.css';

export const BusAlertsTable = ({ alerts = [], currentPage = 1, onPageChange }) => {
  const navigate = useNavigate();

  const handleViewAlert = (alertItem) => {
    navigate(`/police/bus-alerts/${alertItem.id || alertItem.busAlertId}`, {
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
            {alerts.length > 0 ? (
              alerts.map((item) => (
                <tr key={item.id || item.busAlertId}>
                  <td><strong>{item.busAlertId}</strong></td>
                  <td>{item.busId}</td>
                  <td>{item.deviceId}</td>
                  <td>{item.assignmentId}</td>
                  <td>{item.sensorDataId}</td>
                  <td>{item.alertTime}</td>
                  <td style={{ fontWeight: 600 }}>{item.notificationTitle}</td>
                  <td>
                    <span className={`priority-badge ${getPriorityBadgeClass(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>{item.createdAt}</td>
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

      {/* Pagination Footer */}
      <div className="table-pagination-bar">
        <div className="pagination-info">
          Showing 1 to {alerts.length} of 36 alerts
        </div>

        <div className="pagination-controls">
          <button 
            className="pagination-btn" 
            onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          
          <button className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => onPageChange && onPageChange(1)}>
            1
          </button>
          <button className={`pagination-btn ${currentPage === 2 ? 'active' : ''}`} onClick={() => onPageChange && onPageChange(2)}>
            2
          </button>
          <button className={`pagination-btn ${currentPage === 3 ? 'active' : ''}`} onClick={() => onPageChange && onPageChange(3)}>
            3
          </button>
          <button className={`pagination-btn ${currentPage === 4 ? 'active' : ''}`} onClick={() => onPageChange && onPageChange(4)}>
            4
          </button>

          <button 
            className="pagination-btn" 
            onClick={() => onPageChange && onPageChange(Math.min(4, currentPage + 1))}
            disabled={currentPage === 4}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusAlertsTable;
