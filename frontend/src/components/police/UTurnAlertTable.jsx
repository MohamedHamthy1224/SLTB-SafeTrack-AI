import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import '../../styles/uTurnAlerts.css';

const ITEMS_PER_PAGE = 10;

const UTurnAlertTable = ({ alerts = [], loading = false }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(alerts.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleAlerts = alerts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleView = (alert) => {
    const alertId = alert.roadsideAlertId || alert.roadside_alert_id || alert.id;
    navigate(`/police/u-turn-alerts/${alertId}`, { state: { alert } });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPriorityClass = (priority) => {
    if (!priority) return 'medium';
    return String(priority).toLowerCase();
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
              <th>Location</th>
              <th>Notification Title</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  Loading U-Turn alerts from MySQL database...
                </td>
              </tr>
            ) : visibleAlerts.length > 0 ? (
              visibleAlerts.map((alert, idx) => {
                const alertId = alert.roadsideAlertId ?? alert.roadside_alert_id ?? alert.id ?? `alert-${idx}`;
                const unitId = alert.roadsideUnitId ?? alert.roadside_unit_id ?? '—';
                const devId = alert.deviceId ?? alert.device_id ?? '—';
                const rId = alert.routeId ?? alert.route_id ?? '—';
                const sensorId = alert.sensorDataId ?? alert.sensor_data_id ?? '—';
                const aTime = alert.alertTime ?? alert.alert_time ?? '—';
                const locName = alert.locationName ?? alert.location_name ?? '—';
                const notifTitle = alert.notificationTitle ?? alert.notification_title ?? 'U-Turn Alert';
                const priorityVal = alert.priority ?? 'Medium';

                return (
                  <tr key={alertId}>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>#{alertId}</td>
                    <td>{unitId}</td>
                    <td>{devId}</td>
                    <td>{rId}</td>
                    <td>{sensorId}</td>
                    <td>{aTime}</td>
                    <td>{locName}</td>
                    <td>{notifTitle}</td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(priorityVal)}`}>
                        {priorityVal}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-action-eye"
                        onClick={() => handleView(alert)}
                        title="View Alert Details"
                        type="button"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={28} color="#94a3b8" />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#334155' }}>No U-Turn alerts found</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No recorded alert events match the current filter criteria in MySQL.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && alerts.length > 0 && totalPages > 1 && (
        <div className="table-pagination-bar">
          <span className="pagination-info">
            Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, alerts.length)} of {alerts.length} alerts
          </span>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              type="button"
            >
              <ChevronLeft size={13} />
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
                type="button"
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              type="button"
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
