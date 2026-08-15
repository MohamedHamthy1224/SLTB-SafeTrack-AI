import React from 'react';
import { Users, CheckCircle2, XCircle } from 'lucide-react';
import { ReportPagination } from '../common/ReportPagination';
import { ReportExportButton } from '../common/ReportExportButton';
import { ReportEmptyState } from '../common/ReportEmptyState';

export const DriversReport = ({
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
  const total = summary?.totalDrivers ?? 0;
  const active = summary?.activeDrivers ?? 0;
  const inactive = summary?.inactiveDrivers ?? 0;

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
          <div className="card-icon"><Users size={24} /></div>
          <div className="card-info">
            <span className="card-label">Total Drivers</span>
            <h3 className="card-value">{total}</h3>
          </div>
        </div>
        <div className="summary-card green">
          <div className="card-icon"><CheckCircle2 size={24} /></div>
          <div className="card-info">
            <span className="card-label">Active Drivers</span>
            <h3 className="card-value">{active}</h3>
          </div>
        </div>
        <div className="summary-card red">
          <div className="card-icon"><XCircle size={24} /></div>
          <div className="card-info">
            <span className="card-label">Inactive Drivers</span>
            <h3 className="card-value">{inactive}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="report-filter-bar">
        <div className="report-filter-group">
          <label>Gender</label>
          <select
            value={filters.gender || 'all'}
            onChange={(e) => onFilterChange('gender', e.target.value)}
          >
            <option value="all">All</option>
            {(filterOptions.genders || []).map((g) => (
              <option key={g} value={g}>{g}</option>
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

        <div className="report-filter-group">
          <label>Experience Years</label>
          <select
            value={filters.experience_years || 'all'}
            onChange={(e) => onFilterChange('experience_years', e.target.value)}
          >
            <option value="all">All</option>
            {(filterOptions.experienceYears || []).map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
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
      <h3 className="report-section-title">Drivers Report Details</h3>

      {items.length === 0 ? (
        <ReportEmptyState />
      ) : (
        <div className="report-table-wrapper">
          <table className="report-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th className={sortBy === 'driver_id' ? 'sorted' : ''} onClick={() => onSort('driver_id')}>
                  Driver ID {renderSortIcon('driver_id')}
                </th>
                <th className={sortBy === 'full_name' ? 'sorted' : ''} onClick={() => onSort('full_name')}>
                  Full Name {renderSortIcon('full_name')}
                </th>
                <th className={sortBy === 'date_of_birth' ? 'sorted' : ''} onClick={() => onSort('date_of_birth')}>
                  Date of Birth {renderSortIcon('date_of_birth')}
                </th>
                <th className={sortBy === 'gender' ? 'sorted' : ''} onClick={() => onSort('gender')}>
                  Gender {renderSortIcon('gender')}
                </th>
                <th className={sortBy === 'nic' ? 'sorted' : ''} onClick={() => onSort('nic')}>
                  NIC {renderSortIcon('nic')}
                </th>
                <th className={sortBy === 'license_number' ? 'sorted' : ''} onClick={() => onSort('license_number')}>
                  License Number {renderSortIcon('license_number')}
                </th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th className={sortBy === 'experience_years' ? 'sorted' : ''} onClick={() => onSort('experience_years')}>
                  Experience (Years) {renderSortIcon('experience_years')}
                </th>
                <th>Phone</th>
                <th>Email</th>
                <th className={sortBy === 'join_date' ? 'sorted' : ''} onClick={() => onSort('join_date')}>
                  Join Date {renderSortIcon('join_date')}
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
              {items.map((driver, idx) => (
                <tr key={driver.driver_id || idx}>
                  <td><span className="row-number">{(page - 1) * perPage + idx + 1}</span></td>
                  <td>DRV-{String(driver.driver_id).padStart(4, '0')}</td>
                  <td>{driver.full_name || '—'}</td>
                  <td>{driver.date_of_birth || '—'}</td>
                  <td>{driver.gender || '—'}</td>
                  <td>{driver.nic || '—'}</td>
                  <td>{driver.license_number || '—'}</td>
                  <td>{driver.issue_date || '—'}</td>
                  <td>{driver.expiry_date || '—'}</td>
                  <td>{driver.experience_years ?? '—'}</td>
                  <td>{driver.phone || '—'}</td>
                  <td>{driver.email_address || '—'}</td>
                  <td>{driver.join_date || '—'}</td>
                  <td>
                    <span className={`report-status-badge ${statusClass(driver.status)}`}>
                      {driver.status || '—'}
                    </span>
                  </td>
                  <td>{driver.created_at || '—'}</td>
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

export default DriversReport;
