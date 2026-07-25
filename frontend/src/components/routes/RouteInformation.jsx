import React from 'react';
import RouteStatusBadge from './RouteStatusBadge';

export const RouteInformation = ({ route = {} }) => {
  const routeId = route.route_id || route.routeId || 'Not available';
  const routeNumber = route.route_number || route.routeNumber || 'Not available';
  const routeName = route.route_name || route.routeName || 'Not available';
  const startLocation = route.start_location || route.startLocation || 'Not available';
  const endLocation = route.end_location || route.endLocation || 'Not available';
  const distance = route.distance_km ?? route.distanceKm;
  const distanceStr = distance != null ? `${distance} km` : 'Not available';
  const duration = route.estimated_duration ?? route.estimatedDuration;
  const durationStr = duration != null ? `${duration} min` : 'Not available';
  const formattedDuration = route.formatted_duration || route.formattedDuration || durationStr;
  const status = route.status || 'Active';
  const createdAt = route.created_at || route.createdAt || 'Not available';

  return (
    <div className="route-details-wrapper">
      {/* Quick Summary Banner Card */}
      <div className="route-summary-banner-card">
        <div className="summary-col">
          <span className="summary-label">Route Number</span>
          <h4 className="summary-val font-mono">{routeNumber}</h4>
        </div>
        <div className="summary-col main-title">
          <span className="summary-label">Route Name</span>
          <h3 className="summary-val">{routeName}</h3>
        </div>
        <div className="summary-col">
          <span className="summary-label">Status</span>
          <div style={{ marginTop: '0.25rem' }}>
            <RouteStatusBadge status={status} />
          </div>
        </div>
        <div className="summary-col">
          <span className="summary-label">Distance (km)</span>
          <h4 className="summary-val">{distanceStr}</h4>
        </div>
        <div className="summary-col">
          <span className="summary-label">Estimated Duration</span>
          <h4 className="summary-val">{formattedDuration}</h4>
        </div>
        <div className="summary-col">
          <span className="summary-label">Created At</span>
          <span className="summary-val text-sub">{createdAt}</span>
        </div>
      </div>

      {/* Detailed Route Information Section */}
      <div className="info-card">
        <h3 className="info-card-header">Route Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Route ID</span>
            <span className="info-value font-mono">{routeId}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Route Number</span>
            <span className="info-value font-mono">{routeNumber}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Route Name</span>
            <span className="info-value font-semibold">{routeName}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Start Location</span>
            <span className="info-value">{startLocation}</span>
          </div>

          <div className="info-item">
            <span className="info-label">End Location</span>
            <span className="info-value">{endLocation}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Distance (km)</span>
            <span className="info-value">{distanceStr}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Estimated Duration (minutes)</span>
            <span className="info-value">{durationStr}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Status</span>
            <div style={{ marginTop: '0.2rem' }}>
              <RouteStatusBadge status={status} />
            </div>
          </div>

          <div className="info-item">
            <span className="info-label">Created At</span>
            <span className="info-value">{createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteInformation;
