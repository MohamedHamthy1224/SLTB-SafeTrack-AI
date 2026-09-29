import React from 'react';
import { Search, Filter, RotateCcw, Download } from 'lucide-react';
import '../../../styles/uturnManagement.css';

export const UTurnFilter = ({
  searchValue = '',
  onSearchChange,
  selectedStatus = '',
  onStatusChange,
  statusOptions = [],
  selectedRoute = '',
  onRouteChange,
  routeOptions = [],
  onReset,
  onFilter,
  onExport,
  isExporting = false
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onFilter) onFilter();
    }
  };

  return (
    <div className="uturn-filter-card">
      <div className="uturn-filter-row">
        {/* Search Input */}
        <div className="uturn-search-wrap">
          <Search size={16} className="uturn-search-icon" />
          <input
            type="text"
            className="uturn-search-input"
            placeholder="Search by roadside unit ID or location name..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Status Dropdown */}
        <select
          className="uturn-filter-select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by Status"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((opt) => {
            const val = typeof opt === 'object' ? opt.value || opt.name : opt;
            const label = typeof opt === 'object' ? opt.label || opt.name : opt;
            return (
              <option key={val} value={val}>
                {label}
              </option>
            );
          })}
        </select>

        {/* Route Dropdown */}
        <select
          className="uturn-filter-select"
          value={selectedRoute}
          onChange={(e) => onRouteChange(e.target.value)}
          aria-label="Filter by Route"
        >
          <option value="">All Routes</option>
          {routeOptions.map((opt) => {
            const val = typeof opt === 'object' ? opt.routeId || opt.route_id || opt.value : opt;
            const label = typeof opt === 'object'
              ? opt.displayText || (opt.routeNumber ? `Route ${opt.routeNumber} - ${opt.routeName || ''}` : opt.routeName || `Route #${val}`)
              : opt;
            return (
              <option key={val} value={val}>
                {label}
              </option>
            );
          })}
        </select>

        {/* Action Buttons */}
        <div className="uturn-filter-actions">
          <button
            type="button"
            className="btn-uturn-reset"
            onClick={onReset}
            title="Reset all filters"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            type="button"
            className="btn-uturn-filter"
            onClick={onFilter}
            title="Apply filters"
          >
            <Filter size={14} />
            Filter
          </button>

          {onExport && (
            <button
              type="button"
              className="btn-uturn-export"
              onClick={onExport}
              disabled={isExporting}
              title="Export live PDF report"
            >
              <Download size={14} />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UTurnFilter;
