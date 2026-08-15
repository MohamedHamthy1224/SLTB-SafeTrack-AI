import React from 'react';
import { ClipboardList, CheckCircle2 } from 'lucide-react';
import { ReportPagination } from '../common/ReportPagination';
import { ReportExportButton } from '../common/ReportExportButton';
import { ReportEmptyState } from '../common/ReportEmptyState';

export const AssignmentHistoryReport = ({
  summary,
  items,
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
  const total = summary?.totalAssignments ?? 0;
  const active = summary?.activeAssignments ?? 0;

  const renderSortIcon = (field) => {
    const isActive = sortBy === field;
    const arrow = isActive ? (order === 'asc' ? '↑' : '↓') : '';
    return <span className="sort-icon">{isActive ? arrow : '↕'}</span>;
  };

  const formatAssignedBy = (val) => {
    if (!val) return 'SYSTEM';
    return `ADMIN-${String(val).padStart(3, '0')}`;
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="report-summary-cards">
        <div className="summary-card blue">
          <div className="card-icon"><ClipboardList size={24} /></div>
          <div className="card-info">
            <span className="card-label">Total Assignments</span>
            <h3 className="card-value">{total}</h3>
          </div>
        </div>
        <div className="summary-card green">
          <div className="card-icon"><CheckCircle2 size={24} /></div>
          <div className="card-info">
            <span className="card-label">Active Assignments</span>
            <h3 className="card-value">{active}</h3>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
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
      <h3 className="report-section-title">Bus, Route, and Driver Assignment History Report Details</h3>

      {items.length === 0 ? (
        <ReportEmptyState />
      ) : (
        <div className="report-table-wrapper">
          <table className="report-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th className={sortBy === 'assignment_history_id' ? 'sorted' : ''} onClick={() => onSort('assignment_history_id')}>
                  Assignment History ID {renderSortIcon('assignment_history_id')}
                </th>
                <th className={sortBy === 'bus_id' ? 'sorted' : ''} onClick={() => onSort('bus_id')}>
                  Bus ID {renderSortIcon('bus_id')}
                </th>
                <th className={sortBy === 'driver_id' ? 'sorted' : ''} onClick={() => onSort('driver_id')}>
                  Driver ID {renderSortIcon('driver_id')}
                </th>
                <th className={sortBy === 'route_id' ? 'sorted' : ''} onClick={() => onSort('route_id')}>
                  Route ID {renderSortIcon('route_id')}
                </th>
                <th className={sortBy === 'start_datetime' ? 'sorted' : ''} onClick={() => onSort('start_datetime')}>
                  Start Date Time {renderSortIcon('start_datetime')}
                </th>
                <th className={sortBy === 'end_datetime' ? 'sorted' : ''} onClick={() => onSort('end_datetime')}>
                  End Date Time {renderSortIcon('end_datetime')}
                </th>
                <th className={sortBy === 'assigned_by' ? 'sorted' : ''} onClick={() => onSort('assigned_by')}>
                  Assigned By {renderSortIcon('assigned_by')}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.assignment_history_id || idx}>
                  <td><span className="row-number">{(page - 1) * perPage + idx + 1}</span></td>
                  <td>AH-{String(item.assignment_history_id).padStart(4, '0')}</td>
                  <td>BUS-{String(item.bus_id).padStart(4, '0')}</td>
                  <td>DRV-{String(item.driver_id).padStart(4, '0')}</td>
                  <td>ROU-{String(item.route_id).padStart(4, '0')}</td>
                  <td>{item.start_datetime || '—'}</td>
                  <td>
                    {item.end_datetime === 'Ongoing' ? (
                      <span className="report-status-badge ongoing">Ongoing</span>
                    ) : (
                      item.end_datetime || '—'
                    )}
                  </td>
                  <td>{formatAssignedBy(item.assigned_by)}</td>
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

export default AssignmentHistoryReport;
