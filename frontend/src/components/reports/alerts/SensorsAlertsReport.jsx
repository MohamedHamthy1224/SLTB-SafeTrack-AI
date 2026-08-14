import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ReportPagination } from '../common/ReportPagination';
import { ReportExportButton } from '../common/ReportExportButton';
import { ReportEmptyState } from '../common/ReportEmptyState';

export const SensorsAlertsReport = ({
  summary,
  items,
  filterOptions,
  filters,
  onFilterChange,
  onResetFilters,
  page,
  perPage,
  totalItems,
  totalPages,
  onPageChange,
  onPerPageChange,
  sortBy,
  order,
  onSort,
  onExportCSV
}) => {
  const totalAlerts = summary?.totalAlerts ?? 0;

  const renderSortIcon = (field) => {
    const isActive = sortBy === field;
    const arrow = isActive ? (order === 'asc' ? '↑' : '↓') : '';
    return <span className="sort-icon">{isActive ? arrow : '↕'}</span>;
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="report-summary-cards">
        <div className="summary-card orange">
          <div className="card-icon"><AlertTriangle size={24} /></div>
          <div className="card-info">
            <span className="card-label">Total Alerts</span>
            <h3 className="card-value">{totalAlerts}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="report-filter-bar">
        <div className="report-filter-group">
          <label>Bus ID</label>
          <select
            value={filters.bus_id || 'all'}
            onChange={(e) => onFilterChange('bus_id', e.target.value)}
          >
            <option value="all">All</option>
            {(filterOptions.busIds || []).map((id) => (
              <option key={id} value={id}>BUS-{String(id).padStart(4, '0')}</option>
            ))}
          </select>
        </div>

        <div className="report-filter-actions">
          <button className="report-filter-btn secondary" onClick={onResetFilters}>Reset</button>
          <button className="report-filter-btn primary" onClick={() => onPageChange(1)}>Filter</button>
          <ReportExportButton onExport={onExportCSV} disabled={items.length === 0} />
        </div>
      </div>

      {/* Table */}
      <h3 className="report-section-title">Sensors and Alerts Report Details</h3>

      {items.length === 0 ? (
        <ReportEmptyState />
      ) : (
        <div className="report-table-wrapper">
          <table className="report-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th className={sortBy === 'bus_alert_id' ? 'sorted' : ''} onClick={() => onSort('bus_alert_id')}>
                  Bus Alert ID {renderSortIcon('bus_alert_id')}
                </th>
                <th className={sortBy === 'bus_id' ? 'sorted' : ''} onClick={() => onSort('bus_id')}>
                  Bus ID {renderSortIcon('bus_id')}
                </th>
                <th className={sortBy === 'device_id' ? 'sorted' : ''} onClick={() => onSort('device_id')}>
                  Device ID {renderSortIcon('device_id')}
                </th>
                <th className={sortBy === 'assignment_id' ? 'sorted' : ''} onClick={() => onSort('assignment_id')}>
                  Assignment ID {renderSortIcon('assignment_id')}
                </th>
                <th className={sortBy === 'sensor_data_id' ? 'sorted' : ''} onClick={() => onSort('sensor_data_id')}>
                  Sensor Data ID {renderSortIcon('sensor_data_id')}
                </th>
                <th className={sortBy === 'alert_time' ? 'sorted' : ''} onClick={() => onSort('alert_time')}>
                  Alert Time {renderSortIcon('alert_time')}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((alert, idx) => (
                <tr key={alert.bus_alert_id || idx}>
                  <td><span className="row-number">{(page - 1) * perPage + idx + 1}</span></td>
                  <td>BA-{String(alert.bus_alert_id).padStart(4, '0')}</td>
                  <td>BUS-{String(alert.bus_id).padStart(4, '0')}</td>
                  <td>DEV-{String(alert.device_id).padStart(4, '0')}</td>
                  <td>{alert.assignment_id ? `ASN-${String(alert.assignment_id).padStart(4, '0')}` : '—'}</td>
                  <td>{alert.sensor_data_id ? `SD-${String(alert.sensor_data_id).padStart(4, '0')}` : '—'}</td>
                  <td>{alert.alert_time || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ReportPagination
            page={page}
            perPage={perPage}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onPerPageChange={onPerPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default SensorsAlertsReport;
