import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit3, Bus } from 'lucide-react';
import BusStatusBadge from './BusStatusBadge';

export const BusTable = ({ buses = [], loading = false, sortBy, order, onSort }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="table-loading-container">
        <div className="spinner"></div>
        <p>Loading bus fleet records from MySQL database...</p>
      </div>
    );
  }

  if (!buses || buses.length === 0) {
    return (
      <div className="table-empty-container">
        <Bus size={48} className="empty-icon" />
        <h4>No buses found</h4>
        <p>No bus records match the selected search or filter criteria.</p>
      </div>
    );
  }

  const renderSortIndicator = (field) => {
    if (sortBy !== field) return null;
    return order === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="table-responsive-wrapper">
      <table className="bus-management-table">
        <thead>
          <tr>
            <th onClick={() => onSort('bus_number')} className="sortable-col">
              Bus Number {renderSortIndicator('bus_number')}
            </th>
            <th onClick={() => onSort('registration_number')} className="sortable-col">
              Registration Number {renderSortIndicator('registration_number')}
            </th>
            <th onClick={() => onSort('route')} className="sortable-col">
              Route {renderSortIndicator('route')}
            </th>
            <th onClick={() => onSort('driver')} className="sortable-col">
              Assigned Driver {renderSortIndicator('driver')}
            </th>
            <th onClick={() => onSort('service_type')} className="sortable-col">
              Bus Type {renderSortIndicator('service_type')}
            </th>
            <th onClick={() => onSort('capacity')} className="sortable-col text-center">
              Capacity {renderSortIndicator('capacity')}
            </th>
            <th onClick={() => onSort('status')} className="sortable-col text-center">
              Status {renderSortIndicator('status')}
            </th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.bus_id} className="bus-table-row">
              <td className="font-semibold text-primary">
                <div className="bus-number-cell">
                  <Bus size={16} className="cell-bus-icon" />
                  <span>{bus.bus_number}</span>
                </div>
              </td>
              <td>{bus.registration_number}</td>
              <td className="text-secondary">{bus.routeDisplay || 'Unassigned'}</td>
              <td>{bus.driverDisplay || 'Unassigned'}</td>
              <td>{bus.model || bus.service_type || 'Ashok Leyland'}</td>
              <td className="text-center font-medium">{bus.capacity || 0}</td>
              <td className="text-center">
                <BusStatusBadge status={bus.status} />
              </td>
              <td className="actions-cell text-right">
                <button
                  type="button"
                  className="btn-action btn-view"
                  title="View Bus Details"
                  onClick={() => navigate(`/sltb/buses/${bus.bus_id}`)}
                >
                  <Eye size={16} />
                </button>
                <button
                  type="button"
                  className="btn-action btn-edit"
                  title="Edit Bus"
                  onClick={() => navigate(`/sltb/buses/${bus.bus_id}/edit`)}
                >
                  <Edit3 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusTable;
