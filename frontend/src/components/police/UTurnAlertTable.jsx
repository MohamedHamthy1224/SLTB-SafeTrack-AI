import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/uTurnAlerts.css';

const ITEMS_PER_PAGE = 10;

const UTurnAlertTable = ({ alerts }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(alerts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleAlerts = alerts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleView = (alert) => {
    navigate(`/police/u-turn-alerts/${alert.id}`, { state: { alert } });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPriorityClass = (priority) => {
    if (!priority) return '';
    return priority.toLowerCase();
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="uturn-alerts-table-card">
      <div className="table-header-row">
        <div>
          <h3 className="table-card-title">U-Turn Alert Records</h3>
          <span className="table-card-subtitle">{alerts.length} total alerts detected</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="uturn-alerts-table">
          <thead>
            <tr>
              <th>Roadside Alert ID</th>
              <th>Roadside Unit ID</th>
              <th>Device ID</th>
              <th>Route ID</th>
              <th>Sensor Data ID</th>
              <th>Alert Time</th>
              <th>Notification Title</th>
              <th>Priority</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleAlerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.roadsideAlertId}</td>
                <td>{alert.roadsideUnitId}</td>
                <td>{alert.deviceId}</td>
                <td>{alert.routeId}</td>
                <td>{alert.sensorDataId}</td>
                <td>{alert.alertTime}</td>
                <td>{alert.notificationTitle}</td>
                <td>
                  <span className={`priority-badge ${getPriorityClass(alert.priority)}`}>
                    {alert.priority}
                  </span>
                </td>
                <td>{alert.createdAt}</td>
                <td>
                  <button
                    className="btn-action-eye"
                    onClick={() => handleView(alert)}
                    title="View Alert"
                  >
                    <Eye size={13} />
                  </button>
                </td>
              </tr>
            ))}
            {visibleAlerts.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                  No alerts found for selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-pagination-bar">
          <span className="pagination-info">
            Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, alerts.length)} of {alerts.length} alerts
          </span>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={13} />
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UTurnAlertTable;
