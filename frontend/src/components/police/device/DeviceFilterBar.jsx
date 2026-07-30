import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import '../../../styles/deviceManagement.css';

const DeviceFilterBar = ({
  searchValue,
  onSearchChange,
  deviceType,
  onDeviceTypeChange,
  statusFilter,
  onStatusChange,
  onReset,
  onFilter,
}) => {
  return (
    <div className="device-filter-bar">
      {/* Search */}
      <div className="device-search-wrapper">
        <span className="device-search-icon">
          <Search size={14} />
        </span>
        <input
          type="text"
          className="device-search-input"
          placeholder="Search by device code or name..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
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
          <option value="Bus Unit">Bus Unit</option>
          <option value="Roadside Unit">Roadside Unit</option>
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
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="device-filter-btn-group">
        <button className="btn-filter-reset" onClick={onReset}>
          Reset
        </button>
        <button className="btn-filter-apply" onClick={onFilter}>
          <SlidersHorizontal size={13} />
          Filter
        </button>
      </div>
    </div>
  );
};

export default DeviceFilterBar;
