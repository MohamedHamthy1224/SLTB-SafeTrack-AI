import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const RouteFilterPanel = ({
  options = {},
  filters = {},
  onFilterSubmit,
  onReset,
  loading = false
}) => {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [startLocation, setStartLocation] = useState(filters.start_location || '');
  const [endLocation, setEndLocation] = useState(filters.end_location || '');

  // Synchronize local filter state if props change
  useEffect(() => {
    setSearch(filters.search || '');
    setStatus(filters.status || '');
    setStartLocation(filters.start_location || '');
    setEndLocation(filters.end_location || '');
  }, [filters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterSubmit({
      search: search.trim(),
      status,
      start_location: startLocation,
      end_location: endLocation,
      page: 1 // Reset pagination to page 1 on new filter query
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setSearch('');
    setStatus('');
    setStartLocation('');
    setEndLocation('');
    onReset();
  };

  return (
    <form className="route-filter-panel" onSubmit={handleSubmit}>
      <div className="filter-group search-input-group">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="filter-control search-control"
            placeholder="Search route number or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select
          className="filter-control select-control"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Start Location</label>
        <select
          className="filter-control select-control"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {(options.startLocations || []).map((loc, idx) => (
            <option key={`start-${idx}`} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Destination</label>
        <select
          className="filter-control select-control"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {(options.endLocations || []).map((loc, idx) => (
            <option key={`end-${idx}`} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-actions">
        <button
          type="button"
          className="btn btn-secondary btn-reset"
          onClick={handleReset}
          disabled={loading}
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>

        <button
          type="submit"
          className="btn btn-primary btn-filter"
          disabled={loading}
        >
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>
    </form>
  );
};

export default RouteFilterPanel;
