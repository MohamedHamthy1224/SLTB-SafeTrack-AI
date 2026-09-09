import React from 'react';
import { Search, RefreshCw, Download, Calendar } from 'lucide-react';
import '../../../styles/systemLogs.css';

const SystemLogFilterBar = ({
  searchValue,
  onSearchChange,
  selectedUser,
  onUserChange,
  userOptions,
  dateRange,
  onReset,
  onExport,
}) => {
  return (
    <div className="syslog-filter-bar">
      {/* Search */}
      <div className="syslog-search-wrapper">
        <span className="syslog-search-icon">
          <Search size={14} />
        </span>
        <input
          type="text"
          className="syslog-search-input"
          placeholder="Search by activity or user ID..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* User Dropdown */}
      <select
        className="syslog-filter-select"
        value={selectedUser}
        onChange={(e) => onUserChange(e.target.value)}
      >
        <option value="All Users">All Users</option>
        {userOptions.map((u) => {
          if (typeof u === 'object') {
            return (
              <option key={u.userId} value={u.userId}>
                {u.username} (ID: {u.userId})
              </option>
            );
          }
          if (u === 'All Users') return null;
          return (
            <option key={u} value={u}>
              {u}
            </option>
          );
        })}
      </select>

      {/* Date Range Display */}
      <div className="syslog-date-range">
        <Calendar size={14} color="#64748b" />
        <span>{dateRange}</span>
      </div>

      {/* Action Buttons */}
      <div className="syslog-filter-btn-group">
        <button className="btn-syslog-reset" onClick={onReset}>
          <RefreshCw size={13} />
          Reset
        </button>
        <button className="btn-syslog-export" onClick={onExport}>
          <Download size={13} />
          Export
        </button>
      </div>
    </div>
  );
};

export default SystemLogFilterBar;
