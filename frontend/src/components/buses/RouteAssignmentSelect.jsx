import React, { useEffect, useState } from 'react';
import { routeService } from '../../services/routeService';
import { Route } from 'lucide-react';

export const RouteAssignmentSelect = ({ value, onChange, error, onRouteSelect }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await routeService.getRouteOptions();
        if (response.success && Array.isArray(response.data)) {
          setRoutes(response.data);
        }
      } catch (err) {
        console.error("Failed to load routes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    onChange(selectedId);
    if (onRouteSelect && selectedId) {
      const matchedRoute = routes.find(r => String(r.route_id ?? r.routeId) === String(selectedId));
      if (matchedRoute) {
        onRouteSelect(matchedRoute);
      }
    }
  };

  return (
    <div className="form-group select-assignment-group">
      <label className="form-label required">Route</label>
      <div className="select-input-wrapper">
        <select
          className={`form-select ${error ? 'is-invalid' : ''}`}
          value={value || ''}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">{loading ? "Loading routes..." : "Select Route"}</option>
          {routes.map((route) => {
            const rId = route.route_id ?? route.routeId;
            const rNum = route.route_number ?? route.routeNumber;
            const startLoc = route.start_location ?? route.startLocation;
            const endLoc = route.end_location ?? route.endLocation;
            const isActive = route.status === 'Active';

            return (
              <option
                key={rId}
                value={rId}
                disabled={!isActive}
              >
                {rNum} - {startLoc} to {endLoc} {!isActive ? " (Inactive)" : ""}
              </option>
            );
          })}
        </select>
        <Route size={18} className="select-icon" />
      </div>
      {error && <span className="error-message">{error}</span>}
      <div className="info-box info-blue" style={{ marginTop: '0.5rem' }}>
        <span>ℹ Only active routes are shown.</span>
      </div>
    </div>
  );
};

export default RouteAssignmentSelect;
