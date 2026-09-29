import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Ban } from 'lucide-react';
import '../../../styles/uturnManagement.css';

const getStatusBadgeClass = (status = '') => {
  const s = String(status).toLowerCase();
  if (s === 'active') return 'badge-uturn-status active';
  if (s === 'maintenance') return 'badge-uturn-status maintenance';
  return 'badge-uturn-status inactive';
};

export const UTurnTableRow = ({ unit, onDeactivateClick }) => {
  const unitId = unit.roadsideUnitId || unit.roadside_unit_id || unit.id;
  const deviceDisplay = unit.deviceCode || (unit.deviceId ? `DEV-${unit.deviceId}` : '—');
  const routeDisplay = unit.routeNumber
    ? `Route ${unit.routeNumber}`
    : (unit.routeId ? `Route #${unit.routeId}` : '—');

  const latDisplay = unit.latitude !== null && unit.latitude !== undefined ? Number(unit.latitude).toFixed(6) : '—';
  const lngDisplay = unit.longitude !== null && unit.longitude !== undefined ? Number(unit.longitude).toFixed(6) : '—';

  return (
    <tr>
      <td>
        <span className="uturn-id-pill">#{unitId}</span>
      </td>
      <td>
        <span className="uturn-device-text" title={unit.deviceName || ''}>
          {deviceDisplay}
        </span>
      </td>
      <td>
        <span className="uturn-route-text" title={unit.routeName || ''}>
          {routeDisplay}
        </span>
      </td>
      <td>
        <strong className="uturn-location-text">{unit.locationName || unit.location_name}</strong>
      </td>
      <td>{latDisplay}</td>
      <td>{lngDisplay}</td>
      <td>{unit.installationDate || unit.installation_date || '—'}</td>

      {/* Status Badge */}
      <td>
        <span className={getStatusBadgeClass(unit.status)}>{unit.status || 'Active'}</span>
      </td>

      <td>
        <span className="uturn-date-text">{unit.createdAt || unit.created_at || '—'}</span>
      </td>

      {/* Actions */}
      <td>
        <div className="uturn-action-group">
          <Link
            to={`/police/u-turn-management/${unitId}`}
            className="btn-action-icon view"
            title="View Details"
          >
            <Eye size={14} />
          </Link>
          <Link
            to={`/police/u-turn-management/edit/${unitId}`}
            className="btn-action-icon edit"
            title="Edit Unit"
          >
            <Edit2 size={14} />
          </Link>
          <button
            type="button"
            className="btn-action-icon delete"
            onClick={() => onDeactivateClick(unit)}
            title="Deactivate Unit (Set Inactive)"
          >
            <Ban size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UTurnTableRow;
