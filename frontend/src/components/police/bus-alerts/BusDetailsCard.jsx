import React from 'react';
import '../../../styles/view-bus-alert.css';

export const BusDetailsCard = ({ busDetails }) => {
  const bus = busDetails || {
    busId: '101',
    registrationNumber: 'NB-074',
    busNumber: 'SLTB-001',
    serviceType: 'Public Service',
    depot: 'Colombo Central Depot',
    model: 'Ashok Leyland Viking',
    chassisNumber: 'MB1V4N11ALN902345',
    engineNumber: 'H6ET1A902345',
    capacity: 54,
    standingCapacity: 20,
    fuelType: 'Diesel',
    manufactureYear: '2020',
    status: 'Active',
    createdAt: '05 Jan 2024, 08:30:00'
  };

  return (
    <div className="details-card">
      <h3 className="details-card-title">Bus Details</h3>

      <div className="details-table-list">
        <div className="details-row">
          <span className="details-label">Bus ID</span>
          <span className="details-value">{bus.busId}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Registration Number</span>
          <span className="details-value">{bus.registrationNumber}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Bus Number</span>
          <span className="details-value">{bus.busNumber}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Service Type</span>
          <span className="details-value">{bus.serviceType}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Depot</span>
          <span className="details-value">{bus.depot}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Model</span>
          <span className="details-value">{bus.model}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Chassis Number</span>
          <span className="details-value">{bus.chassisNumber}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Engine Number</span>
          <span className="details-value">{bus.engineNumber}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Capacity</span>
          <span className="details-value">{bus.capacity}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Standing Capacity</span>
          <span className="details-value">{bus.standingCapacity}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Fuel Type</span>
          <span className="details-value">{bus.fuelType}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Manufacture Year</span>
          <span className="details-value">{bus.manufactureYear}</span>
        </div>

        <div className="details-row">
          <span className="details-label">Status</span>
          <span className="details-value">
            <span className="priority-badge low">
              {bus.status}
            </span>
          </span>
        </div>

        <div className="details-row">
          <span className="details-label">Created At</span>
          <span className="details-value">{bus.createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default BusDetailsCard;
