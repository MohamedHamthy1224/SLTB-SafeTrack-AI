import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const BusFilterPanel = ({
  searchQuery,
  setSearchQuery,
  selectedRoute,
  setSelectedRoute,
  selectedDriver,
  setSelectedDriver,
  selectedStatus,
  setSelectedStatus,
  routes = [],
  drivers = [],
  onApplyFilter,
  onResetFilter
}) => {
  // Deduplicate and filter routes safely
  const validRoutes = [];
  const seenRouteIds = new Set();

  routes.forEach((r) => {
    if (!r) return;
    const rId = r.route_id ?? r.routeId;
    const rNum = r.route_number ?? r.routeNumber;
    const startLoc = r.start_location ?? r.startLocation;
    const endLoc = r.end_location ?? r.endLocation;
    const rStatus = r.status;

    if (!rId || !rNum || !startLoc || !endLoc) return;
    if (rNum === '--' || startLoc === '--' || endLoc === '--') return;
    if (rStatus && rStatus !== 'Active') return;
    if (seenRouteIds.has(rId)) return;

    seenRouteIds.add(rId);
    validRoutes.push({
      routeId: rId,
      label: `${rNum} - ${startLoc} to ${endLoc}`
    });
  });

  // Deduplicate and filter drivers safely
  const validDrivers = [];
  const seenDriverIds = new Set();

  drivers.forEach((d) => {
    if (!d) return;
    const dId = d.driver_id ?? d.driverId;
    const fullName = d.full_name ?? d.fullName;
    const dStatus = d.status;

    if (!dId || !fullName || fullName === '--' || fullName === 'NULL' || fullName === 'Undefined') return;
    if (dStatus && dStatus !== 'Active') return;
    if (seenDriverIds.has(dId)) return;

    seenDriverIds.add(dId);
    validDrivers.push({
      driverId: dId,
      label: fullName
    });
  });

  return (
    <div className="bus-filter-panel">
      {/* Search Input */}
      <div className="filter-search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Search by bus number, registration..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApplyFilter()}
        />
        <Search className="search-icon" size={18} />
      </div>

      {/* Select Route Dropdown */}
      <div className="filter-select-group">
        <label className="select-label">Select Route</label>
        <select
          className="filter-select"
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
        >
          <option value="all">All Routes</option>
          {validRoutes.map((r) => (
            <option key={r.routeId} value={r.routeId}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Select Driver Dropdown */}
      <div className="filter-select-group">
        <label className="select-label">Select Driver</label>
        <select
          className="filter-select"
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
        >
          <option value="all">All Drivers</option>
          {validDrivers.map((d) => (
            <option key={d.driverId} value={d.driverId}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Select Status Dropdown */}
      <div className="filter-select-group">
        <label className="select-label">Select Status</label>
        <select
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All Status">All Status</option>
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Filter Actions */}
      <div className="filter-actions">
        <button type="button" className="btn-reset" onClick={onResetFilter}>
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
        <button type="button" className="btn-filter" onClick={onApplyFilter}>
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
};

export default BusFilterPanel;
