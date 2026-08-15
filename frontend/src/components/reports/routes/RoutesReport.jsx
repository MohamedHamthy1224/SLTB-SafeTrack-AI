import React from 'react';
import { MapPin, CheckCircle2, XCircle, Ruler } from 'lucide-react';
import { ReportPagination } from '../common/ReportPagination';
import { ReportExportButton } from '../common/ReportExportButton';
import { ReportEmptyState } from '../common/ReportEmptyState';

export const RoutesReport = ({
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
  onExportCSV,
  onExportPDF,
  csvExporting,
  pdfGenerating
}) => {
  const total = summary?.totalRoutes ?? 0;
  const active = summary?.activeRoutes ?? 0;
  const inactive = summary?.inactiveRoutes ?? 0;
  const totalDistance = summary?.totalDistanceKm ?? 0;

  const renderSortIcon = (field) => {
    const isActive = sortBy === field;
    const arrow = isActive ? (order === 'asc' ? '↑' : '↓') : '';
    return <span className="sort-icon">{isActive ? arrow : '↕'}</span>;
  };

  const statusClass = (status) => {
    if (!status) return '';
    return status.toLowerCase() === 'active' ? 'active' : 'inactive';
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="report-summary-cards">
        <div className="summary-card blue">
          <div className="card-icon"><MapPin size={24} /></div>
          <div className="card-info">
            <span className="card-label">Total Routes</span>
            <h3 className="card-value">{total}</h3>
          </div>
        </div>
        <div className="summary-card green">
          <div className="card-icon"><CheckCircle2 size={24} /></div>
          <div className="card-info">
            <span className="card-label">Active Routes</span>
            <h3 className="card-value">{active}</h3>
          </div>
        </div>
        <div className="summary-card red">
          <div className="card-icon"><XCircle size={24} /></div>
          <div className="card-info">
            <span className="card-label">Inactive Routes</span>
            <h3 className="card-value">{inactive}</h3>
          </div>
        </div>
        <div className="summary-card teal">
          <div className="card-icon"><Ruler size={24} /></div>
          <div className="card-info">
            <span className="card-label">Total Distance (km)</span>
            <h3 className="card-value">{Number(totalDistance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="report-filter-bar">
        <div className="report-filter-group">
          <label>Status</label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            {(filterOptions.statuses || []).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="report-filter-actions">
          <button className="report-filter-btn secondary" onClick={onResetFilters}>Reset</button>
          <button className="report-filter-btn primary" onClick={() => onPageChange(1)}>Filter</button>
          <ReportExportButton
            onExportCSV={onExportCSV}
            onExportPDF={onExportPDF}
            disabled={items.length === 0}
            csvLoading={csvExporting}
            pdfLoading={pdfGenerating}
          />
        </div>
      </div>

      {/* Table */}
      <h3 className="report-section-title">Routes Report Details</h3>

      {items.length === 0 ? (
        <ReportEmptyState />
      ) : (
        <div className="report-table-wrapper">
          <table className="report-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th className={sortBy === 'route_number' ? 'sorted' : ''} onClick={() => onSort('route_number')}>
                  Route Number {renderSortIcon('route_number')}
                </th>
                <th className={sortBy === 'route_name' ? 'sorted' : ''} onClick={() => onSort('route_name')}>
                  Route Name {renderSortIcon('route_name')}
                </th>
                <th className={sortBy === 'start_location' ? 'sorted' : ''} onClick={() => onSort('start_location')}>
                  Start Location {renderSortIcon('start_location')}
                </th>
                <th className={sortBy === 'end_location' ? 'sorted' : ''} onClick={() => onSort('end_location')}>
                  End Location {renderSortIcon('end_location')}
                </th>
                <th className={sortBy === 'distance_km' ? 'sorted' : ''} onClick={() => onSort('distance_km')}>
                  Distance (km) {renderSortIcon('distance_km')}
                </th>
                <th className={sortBy === 'estimated_duration' ? 'sorted' : ''} onClick={() => onSort('estimated_duration')}>
                  Estimated Duration (min) {renderSortIcon('estimated_duration')}
                </th>
                <th className={sortBy === 'status' ? 'sorted' : ''} onClick={() => onSort('status')}>
                  Status {renderSortIcon('status')}
                </th>
                <th className={sortBy === 'created_at' ? 'sorted' : ''} onClick={() => onSort('created_at')}>
                  Created At {renderSortIcon('created_at')}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((route, idx) => (
                <tr key={route.route_id || idx}>
                  <td><span className="row-number">{(page - 1) * perPage + idx + 1}</span></td>
                  <td>{route.route_number || '—'}</td>
                  <td>{route.route_name || '—'}</td>
                  <td>{route.start_location || '—'}</td>
                  <td>{route.end_location || '—'}</td>
                  <td>{route.distance_km != null ? Number(route.distance_km).toFixed(2) : '—'}</td>
                  <td>{route.estimated_duration ?? '—'}</td>
                  <td>
                    <span className={`report-status-badge ${statusClass(route.status)}`}>
                      {route.status || '—'}
                    </span>
                  </td>
                  <td>{route.created_at || '—'}</td>
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

export default RoutesReport;
