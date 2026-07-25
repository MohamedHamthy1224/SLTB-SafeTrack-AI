import React from 'react';
import { Bus, Calendar, Users, MapPin, Fuel, Shield, Layers } from 'lucide-react';
import BusStatusBadge from './BusStatusBadge';
import busPlaceholderImg from '../../assets/images/sltb_bus_bg.jpg';

export const BusDetailsCard = ({ bus }) => {
  if (!bus) return null;

  const totalCapacity = (Number(bus.capacity) || 0) + (Number(bus.standing_capacity) || 0);

  return (
    <div className="bus-details-main-card">
      <div className="bus-details-grid">
        {/* Left Section: Bus Image & Primary Badges */}
        <div className="bus-details-left">
          <div className="bus-image-wrapper">
            <img src={busPlaceholderImg} alt={`Bus ${bus.bus_number}`} className="bus-details-image" />
            <div className="image-status-overlay">
              <BusStatusBadge status={bus.status} />
            </div>
          </div>
          <div className="bus-title-header">
            <h2>{bus.bus_number || 'N/A'}</h2>
            <div className="bus-sub-title">
              <span className="model-name">{bus.model || 'Lanka Ashok Leyland Viking'}</span>
              {bus.fuel_type && (
                <span className="fuel-badge">
                  <Fuel size={12} />
                  {bus.fuel_type}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Core Vehicle Information */}
        <div className="bus-details-right">
          <div className="info-grid-2col">
            <div className="info-item">
              <span className="info-label">
                <Bus size={16} /> Bus Number
              </span>
              <span className="info-value">{bus.bus_number || 'Not available'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">
                <Shield size={16} /> Registration Number
              </span>
              <span className="info-value">{bus.registration_number || 'Not available'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">
                <Layers size={16} /> Vehicle Type
              </span>
              <span className="info-value">{bus.service_type || 'Public Service Bus'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">
                <Calendar size={16} /> Manufactured Year
              </span>
              <span className="info-value">{bus.manufacture_year || 'Not available'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">
                <Calendar size={16} /> Registration Date
              </span>
              <span className="info-value">{bus.registration_date || bus.created_at || 'Not available'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">
                <Users size={16} /> Seating Capacity
              </span>
              <span className="info-value">{bus.capacity || 0}</span>
            </div>

            <div className="info-item">
              <span className="info-label">
                <Users size={16} /> Standing Capacity
              </span>
              <span className="info-value">{bus.standing_capacity || 0}</span>
            </div>

            <div className="info-item highlight-total">
              <span className="info-label">
                <Users size={16} /> Total Capacity
              </span>
              <span className="info-value font-bold">{totalCapacity}</span>
            </div>

            <div className="info-item full-width">
              <span className="info-label">
                <MapPin size={16} /> Depot
              </span>
              <span className="info-value depot-text">{bus.depot || 'SLTB Main Depot - Batticaloa'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetailsCard;
