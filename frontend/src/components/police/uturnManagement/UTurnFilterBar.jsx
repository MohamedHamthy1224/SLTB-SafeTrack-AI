import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import '../../../styles/uturnManagement.css';

const UTurnFilterBar = ({
  searchValue,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  statusOptions = [],
  selectedRoute,
  onRouteChange,
  routeOptions = [],
  onReset,
  onFilter,
  onExport,
}) => {
  return (
    <div className="uturn-filter-card">
      <div className="uturn-filter-row">
        {/* Search Input */}
        <div className="uturn-search-wrap">
          <Search size={15} className="uturn-search-icon" />
          <input
            type="text"
            className="uturn-search-input"
            placeholder="Search by roadside unit ID or location name..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <select
          className="uturn-filter-select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Route Dropdown */}
        <select
          className="uturn-filter-select"
          value={selectedRoute}
          onChange={(e) => onRouteChange(e.target.value)}
        >
          {routeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        <button type="button" className="btn-uturn-reset" onClick={onReset}>
          Reset
        </button>

        {/* Filter Button */}
        <button type="button" className="btn-uturn-filter" onClick={onFilter}>
          <Filter size={14} />
          Filter
        </button>

        {/* Export Button */}
        <button type="button" className="btn-uturn-export" onClick={onExport}>
          <Download size={14} />
          Export
        </button>
      </div>
    </div>
  );
};

export default UTurnFilterBar;
