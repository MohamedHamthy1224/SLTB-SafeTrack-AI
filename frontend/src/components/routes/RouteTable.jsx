import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, PowerOff } from 'lucide-react';
import RouteStatusBadge from './RouteStatusBadge';

export const RouteTable = ({
  routes = [],
  loading = false,
  onDeactivateClick
}) => {
  if (loading) {
    return (
      <div className="table-responsive">
        <table className="route-table">
          <thead>
            <tr>
              <th>Route No.</th>
              <th>Route Name</th>
              <th>Start Location</th>
              <th>Destination</th>
              <th>Distance</th>
              <th>Est. Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((idx) => (
              <tr key={`skeleton-${idx}`} className="skeleton-row">
                <td colSpan={8}>
                  <div className="skeleton-line" style={{ height: '24px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)' }}></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!routes || routes.length === 0) {
    return (
      <div className="empty-table-state" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
        <p style={{ fontSize: '1.05rem', fontWeight: '500' }}>No route records found.</p>
        <p style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.25rem' }}>
          Try clearing your filter inputs or add a new route.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="route-table">
        <thead>
          <tr>
            <th>Route No.</th>
            <th>Route Name</th>
            <th>Start Location</th>
            <th>Destination</th>
            <th>Distance</th>
            <th>Est. Duration</th>
            <th>Status</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => {
            const routeId = r.route_id || r.routeId;
            const routeNumber = r.route_number || r.routeNumber;
            const routeName = r.route_name || r.routeName;
            const startLocation = r.start_location || r.startLocation;
            const endLocation = r.end_location || r.endLocation;
            const distance = r.distance_km ?? r.distanceKm;
            const duration = r.estimated_duration ?? r.estimatedDuration;
            const formattedDuration = r.formatted_duration || r.formattedDuration || `${duration} min`;
            const status = r.status || 'Active';
            const isInactive = status === 'Inactive';

            return (
              <tr key={routeId} className={isInactive ? 'row-inactive' : ''}>
                <td className="font-mono">
                  <span className="route-number-pill">{routeNumber}</span>
                </td>
                <td className="font-semibold">{routeName}</td>
                <td>{startLocation}</td>
                <td>{endLocation}</td>
                <td>{distance != null ? `${distance} km` : 'N/A'}</td>
                <td>{formattedDuration}</td>
                <td>
                  <RouteStatusBadge status={status} />
                </td>
                <td>
                  <div className="action-buttons-group">
                    {/* 1. Eye Icon: View Details */}
                    <Link
                      to={`/sltb/routes/${routeId}`}
                      className="action-btn action-btn-view"
                      title="View Route Details"
                    >
                      <Eye size={17} />
                    </Link>

                    {/* 2. Pencil Icon: Edit Route */}
                    <Link
                      to={`/sltb/routes/${routeId}/edit`}
                      className="action-btn action-btn-edit"
                      title="Edit Route Details"
                    >
                      <Edit3 size={17} />
                    </Link>

                    {/* 3. Deactivate Icon */}
                    <button
                      type="button"
                      className={`action-btn action-btn-deactivate ${isInactive ? 'disabled' : ''}`}
                      title={isInactive ? 'This route is already inactive.' : 'Deactivate Route'}
                      disabled={isInactive}
                      onClick={() => !isInactive && onDeactivateClick && onDeactivateClick(r)}
                    >
                      <PowerOff size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RouteTable;
