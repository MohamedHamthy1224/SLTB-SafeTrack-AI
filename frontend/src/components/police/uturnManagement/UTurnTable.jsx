import React from 'react';
import UTurnTableRow from './UTurnTableRow';
import '../../../styles/uturnManagement.css';

export const UTurnTable = ({ units = [], isLoading = false, onDeactivateClick }) => {
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
            {isLoading ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#64748b' }}>
                    <div className="uturn-spinner" style={{ width: 22, height: 22 }}></div>
                    <span>Loading roadside U-turn units...</span>
                  </div>
                </td>
              </tr>
            ) : units.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <div className="uturn-empty-state">
                    <div className="uturn-empty-icon">📍</div>
                    <h3 className="uturn-empty-title">No U-Turn units found</h3>
                    <p className="uturn-empty-desc">There are no roadside U-turn units matching the current filter criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              units.map((unit) => {
                const keyId = unit.roadsideUnitId || unit.roadside_unit_id || unit.id;
                return (
                  <UTurnTableRow
                    key={keyId}
                    unit={unit}
                    onDeactivateClick={onDeactivateClick}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UTurnTable;
