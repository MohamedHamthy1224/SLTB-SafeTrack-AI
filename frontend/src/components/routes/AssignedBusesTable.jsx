import React from 'react';
import RouteStatusBadge from './RouteStatusBadge';

export const AssignedBusesTable = ({ buses = [], loading = false }) => {
  if (loading) {
    return (
      <div className="info-card assigned-buses-section">
        <h3 className="info-card-header">Assigned Buses</h3>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading assigned buses...
        </div>
      </div>
    );
  }

  const hasBuses = buses && buses.length > 0;

  return (
    <div className="info-card assigned-buses-section">
      <h3 className="info-card-header">Assigned Buses</h3>

      {!hasBuses ? (
        <div className="empty-buses-msg" style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
          <p style={{ fontSize: '0.95rem', fontWeight: '500' }}>
            No active buses are currently assigned to this route.
          </p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="assigned-buses-table">
              <thead>
                <tr>
                  <th>Bus ID</th>
                  <th>Bus Number</th>
                  <th>Registration Number</th>
                  <th>Depot</th>
                  <th>Model</th>
                  <th>Capacity</th>
                  <th>Manufacture Year</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((b, idx) => {
                  const busId = b.busId || b.bus_id || idx + 1;
                  const busNumber = b.busNumber || b.bus_number || 'N/A';
                  const regNumber = b.registrationNumber || b.registration_number || 'N/A';
                  const depot = b.depot || 'N/A';
                  const model = b.model || 'N/A';
                  const capacity = b.capacity ?? 0;
                  const year = b.manufactureYear || b.manufacture_year || 'N/A';
                  const status = b.status || 'Active';
                  const createdAt = b.createdAt || b.created_at || 'N/A';

                  return (
                    <tr key={busId}>
                      <td className="font-mono">{busId}</td>
                      <td className="font-semibold">{busNumber}</td>
                      <td>{regNumber}</td>
                      <td>{depot}</td>
                      <td>{model}</td>
                      <td>{capacity}</td>
                      <td>{year}</td>
                      <td>
                        <RouteStatusBadge status={status} />
                      </td>
                      <td className="text-sub">{createdAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="assigned-buses-footer">
            <span>Total Buses: <strong>{buses.length}</strong></span>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignedBusesTable;
