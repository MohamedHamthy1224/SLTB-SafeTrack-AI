import React from 'react';
import { Search, Download, Plus } from 'lucide-react';
import '../../../styles/userManagement.css';

const UserFilterBar = ({
  searchValue,
  onSearchChange,
  selectedRole,
  onRoleChange,
  roleOptions,
  selectedStatus,
  onStatusChange,
  statusOptions,
  onExport,
  onAddUser,
}) => {
  return (
    <div className="user-filter-bar">
      {/* Search Input */}
      <div className="user-search-wrapper">
        <span className="user-search-icon">
          <Search size={14} />
        </span>
        <input
          type="text"
          className="user-search-input"
          placeholder="Search by name, username or email..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Role Dropdown */}
      <select
        className="user-filter-select"
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value)}
      >
        {roleOptions.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      {/* Status Dropdown */}
      <select
        className="user-filter-select"
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        {statusOptions.map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>

      {/* Action Buttons */}
      <div className="user-filter-btn-group">
        <button className="btn-user-export" onClick={onExport}>
          <Download size={14} />
          Export Users
        </button>
        <button className="btn-add-user" onClick={onAddUser}>
          <Plus size={15} />
          Add User
        </button>
      </div>
    </div>
  );
};

export default UserFilterBar;
