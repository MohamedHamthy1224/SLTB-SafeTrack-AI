import React from 'react';
import { Bus, CheckCircle2, Wrench, XCircle, ArrowUpDown } from 'lucide-react';
import { ReportPagination } from '../common/ReportPagination';
import { ReportExportButton } from '../common/ReportExportButton';
import { ReportEmptyState } from '../common/ReportEmptyState';

export const BusesReport = ({
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
  const total = summary?.totalBuses ?? 0;
  const active = summary?.activeBuses ?? 0;
  const maintenance = summary?.maintenanceBuses ?? 0;
  const inactive = summary?.inactiveBuses ?? 0;

  const renderSortIcon = (field) => {
    const isActive = sortBy === field;
    const arrow = isActive ? (order === 'asc' ? '↑' : '↓') : '';
    return (
      <span className={`sort-icon`}>{isActive ? arrow : '↕'}</span>
    );
  };

  const statusClass = (status) => {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s === 'active') return 'active';
    if (s === 'maintenance') return 'maintenance';
    if (s === 'inactive') return 'inactive';
    return '';
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="report-summary-cards">
        <div className="summary-card blue">
          <div className="card-icon"><Bus size={24} /></div>
          <div className="card-info">
            <span className="card-label">Total Buses</span>
            <h3 className="card-value">{total}</h3>
          </div>
        </div>
        <div className="summary-card green">
          <div className="card-icon"><CheckCircle2 size={24} /></div>
          <div className="card-info">
            <span className="card-label">Active Buses</span>
            <h3 className="card-value">{active}</h3>
          </div>
        </div>
        <div className="summary-card orange">
          <div className="card-icon"><Wrench size={24} /></div>
          <div className="card-info">
            <span className="card-label">Maintenance Buses</span>
            <h3 className="card-value">{maintenance}</h3>
          </div>
        </div>
        <div className="summary-card red">
          <div className="card-icon"><XCircle size={24} /></div>
          <div className="card-info">
            <span className="card-label">Inactive Buses</span>
            <h3 className="card-value">{inactive}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="report-filter-bar">
        <div className="report-filter-group">
          <label>Service Type</label>
          <select
            value={filters.service_type || 'all'}
            onChange={(e) => onFilterChange('service_type', e.target.value)}
          >
            <option value="all">All</option>
            {(filterOptions.serviceTypes || []).map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div className="report-filter-group">
          <label>Depot</label>
          <select
            value={filters.depot || 'all'}
            onChange={(e) => onFilterChange('depot', e.target.value)}
          >
            <option value="all">All</option>
            {(filterOptions.depots || []).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="report-filter-group">
          <label>Status</label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">All</option>
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
      <h3 className="report-section-title">Bus Report Details</h3>

      {items.length === 0 ? (
        <ReportEmptyState />
      ) : (
        <div className="report-table-wrapper">
          <table className="report-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th className={sortBy === 'bus_id' ? 'sorted' : ''} onClick={() => onSort('bus_id')}>
                  Bus ID {renderSortIcon('bus_id')}
                </th>
                <th className={sortBy === 'registration_number' ? 'sorted' : ''} onClick={() => onSort('registration_number')}>
                  Registration Number {renderSortIcon('registration_number')}
                </th>
                <th className={sortBy === 'bus_number' ? 'sorted' : ''} onClick={() => onSort('bus_number')}>
                  Bus Number {renderSortIcon('bus_number')}
                </th>
                <th className={sortBy === 'service_type' ? 'sorted' : ''} onClick={() => onSort('service_type')}>
                  Service Type {renderSortIcon('service_type')}
                </th>
                <th className={sortBy === 'depot' ? 'sorted' : ''} onClick={() => onSort('depot')}>
                  Depot {renderSortIcon('depot')}
                </th>
                <th className={sortBy === 'model' ? 'sorted' : ''} onClick={() => onSort('model')}>
                  Model {renderSortIcon('model')}
                </th>
                <th className={sortBy === 'chassis_number' ? 'sorted' : ''} onClick={() => onSort('chassis_number')}>
                  Chassis Number {renderSortIcon('chassis_number')}
                </th>
                <th className={sortBy === 'engine_number' ? 'sorted' : ''} onClick={() => onSort('engine_number')}>
                  Engine Number {renderSortIcon('engine_number')}
                </th>
                <th className={sortBy === 'capacity' ? 'sorted' : ''} onClick={() => onSort('capacity')}>
                  Capacity {renderSortIcon('capacity')}
                </th>
                <th className={sortBy === 'standing_capacity' ? 'sorted' : ''} onClick={() => onSort('standing_capacity')}>
                  Standing Capacity {renderSortIcon('standing_capacity')}
                </th>
                <th className={sortBy === 'fuel_type' ? 'sorted' : ''} onClick={() => onSort('fuel_type')}>
                  Fuel Type {renderSortIcon('fuel_type')}
                </th>
                <th className={sortBy === 'manufacture_year' ? 'sorted' : ''} onClick={() => onSort('manufacture_year')}>
                  Manufacture Year {renderSortIcon('manufacture_year')}
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
              {items.map((bus, idx) => (
                <tr key={bus.bus_id || idx}>
                  <td><span className="row-number">{(page - 1) * perPage + idx + 1}</span></td>
                  <td>BUS-{String(bus.bus_id).padStart(4, '0')}</td>
                  <td>{bus.registration_number || '—'}</td>
                  <td>{bus.bus_number || '—'}</td>
                  <td>{bus.service_type || '—'}</td>
                  <td>{bus.depot || '—'}</td>
                  <td>{bus.model || '—'}</td>
                  <td>{bus.chassis_number || '—'}</td>
                  <td>{bus.engine_number || '—'}</td>
                  <td>{bus.capacity ?? '—'}</td>
                  <td>{bus.standing_capacity ?? '—'}</td>
                  <td>{bus.fuel_type || '—'}</td>
                  <td>{bus.manufacture_year || '—'}</td>
                  <td>
                    <span className={`report-status-badge ${statusClass(bus.status)}`}>
                      {bus.status || '—'}
                    </span>
                  </td>
                  <td>{bus.created_at || '—'}</td>
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

export default BusesReport;
