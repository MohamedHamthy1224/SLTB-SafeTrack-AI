import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import '../../../styles/policeDeviceManagement.css';

export const DeviceFilter = ({
  searchValue,
  onSearchChange,
  deviceType,
  onDeviceTypeChange,
  statusFilter,
  onStatusChange,
  deviceTypes = [],
  deviceStatuses = [],
  onReset,
  onFilter,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onFilter();
    }
  };

  return (
    <div className="device-filter-bar">
      {/* Search Input */}
      <div className="device-search-wrapper">
        <span className="device-search-icon">
          <Search size={14} />
        </span>
        <input
          type="text"
          className="device-search-input"
          placeholder="Search by device code or name"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Device Type Dropdown */}
      <div className="device-filter-group">
        <span className="device-filter-label">Device Type</span>
        <select
          className="device-filter-select"
          value={deviceType}
          onChange={(e) => onDeviceTypeChange(e.target.value)}
        >
          <option value="all">All Types</option>
          {deviceTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Status Dropdown */}
      <div className="device-filter-group">
        <span className="device-filter-label">Status</span>
        <select
          className="device-filter-select"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">All Status</option>
          {deviceStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="device-filter-btn-group">
        <button className="btn-filter-reset" onClick={onReset} title="Reset all filters">
          <RotateCcw size={12} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
          Reset
        </button>
        <button className="btn-filter-apply" onClick={onFilter} title="Apply search and filters">
          <SlidersHorizontal size={13} />
          Filter
        </button>
      </div>
    </div>
  );
};

export default DeviceFilter;
