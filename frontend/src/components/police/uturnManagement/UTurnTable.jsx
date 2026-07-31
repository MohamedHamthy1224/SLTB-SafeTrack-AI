import React from 'react';
import UTurnTableRow from './UTurnTableRow';
import '../../../styles/uturnManagement.css';

const UTurnTable = ({ units = [], onDeleteClick }) => {
  return (
    <div className="uturn-table-card">
      <div className="uturn-table-wrapper">
        <table className="uturn-table">
          <thead>
            <tr>
              <th>Roadside Unit ID</th>
              <th>Device ID</th>
              <th>Route ID</th>
              <th>Location Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Installation Date</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No U-turn units found matching the selected criteria.
                </td>
              </tr>
            ) : (
              units.map((unit) => (
                <UTurnTableRow
                  key={unit.id}
                  unit={unit}
                  onDeleteClick={onDeleteClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UTurnTable;
