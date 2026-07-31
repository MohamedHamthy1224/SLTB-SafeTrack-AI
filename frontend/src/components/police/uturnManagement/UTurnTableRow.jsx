import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Ban } from 'lucide-react';
import '../../../styles/uturnManagement.css';

const getStatusBadgeClass = (status = '') => {
  const s = status.toLowerCase();
  if (s === 'active') return 'badge-uturn-status active';
  if (s === 'maintenance') return 'badge-uturn-status maintenance';
  return 'badge-uturn-status inactive';
};

const UTurnTableRow = ({ unit, onDeleteClick }) => {
  return (
    <tr>
      <td>
        <strong>{unit.roadsideUnitId}</strong>
      </td>
      <td>{unit.deviceId}</td>
      <td>{unit.routeId}</td>
      <td>{unit.locationName}</td>
      <td>{unit.latitude}</td>
      <td>{unit.longitude}</td>
      <td>{unit.installationDate}</td>

      {/* Status Badge */}
      <td>
        <span className={getStatusBadgeClass(unit.status)}>{unit.status}</span>
      </td>

      <td>{unit.createdAt}</td>

      {/* Actions */}
      <td>
        <div className="uturn-action-group">
          <Link
            to={`/police/uturn-management/view/${unit.id}`}
            className="btn-action-icon view"
            title="View Details"
          >
            <Eye size={13} />
          </Link>
          <Link
            to={`/police/uturn-management/edit/${unit.id}`}
            className="btn-action-icon edit"
            title="Edit Unit"
          >
            <Edit2 size={13} />
          </Link>
          <button
            type="button"
            className="btn-action-icon delete"
            onClick={() => onDeleteClick(unit)}
            title="Delete Unit"
          >
            <Ban size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UTurnTableRow;
