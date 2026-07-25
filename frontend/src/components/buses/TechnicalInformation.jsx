import React from 'react';
import { Settings, Cpu, Fuel } from 'lucide-react';

export const TechnicalInformation = ({ bus }) => {
  if (!bus) return null;

  return (
    <div className="technical-info-card">
      <div className="tech-card-header">
        <Settings size={20} className="header-icon" />
        <h3>Technical Information</h3>
      </div>

      <div className="tech-info-grid">
        {/* Chassis Number */}
        <div className="tech-info-box">
          <div className="tech-icon-wrapper">
            <Cpu size={20} />
          </div>
          <div className="tech-content">
            <span className="tech-label">Chassis Number</span>
            <span className="tech-value">{bus.chassis_number || 'Not available'}</span>
          </div>
        </div>

        {/* Engine Number */}
        <div className="tech-info-box">
          <div className="tech-icon-wrapper">
            <Settings size={20} />
          </div>
          <div className="tech-content">
            <span className="tech-label">Engine Number</span>
            <span className="tech-value">{bus.engine_number || 'Not available'}</span>
          </div>
        </div>

        {/* Fuel Type */}
        <div className="tech-info-box">
          <div className="tech-icon-wrapper">
            <Fuel size={20} />
          </div>
          <div className="tech-content">
            <span className="tech-label">Fuel Type</span>
            <span className="tech-value">{bus.fuel_type || 'Not available'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalInformation;
