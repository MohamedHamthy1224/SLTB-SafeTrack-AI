import React from 'react';
import { RotateCcw, Radio } from 'lucide-react';
import '../../styles/police-cards.css';

export const PoliceUTurnCard = ({ data }) => {
  const leftSensor = data?.leftSensor || {
    status: 'SAFE',
    ledStatus: 'OFF',
    distance: '—',
    riskPercentage: '0%',
    riskLevel: 'LOW'
  };

  const rightSensor = data?.rightSensor || {
    status: 'SAFE',
    ledStatus: 'OFF',
    distance: '—',
    riskPercentage: '0%',
    riskLevel: 'LOW'
  };

  return (
    <div className="police-monitor-card">
      <div className="monitor-card-header">
        <RotateCcw size={22} className="monitor-card-header-icon" />
        <h3 className="monitor-card-title">U-Turn Safety Monitor</h3>
      </div>

      <div className="uturn-safety-grid">
        {/* Left Sensor */}
        <div className="uturn-sub-column">
          <div className="sub-column-header" style={{ fontSize: '0.95rem', fontWeight: 800 }}>
            Left Sensor
          </div>
          <div className={`sensor-circle-badge ${leftSensor.status === 'SAFE' ? 'safe' : 'detected'}`}>
            <Radio size={28} />
          </div>
          <div className={`sensor-status-tag ${leftSensor.status === 'SAFE' ? 'safe' : 'detected'}`}>
            {leftSensor.status}
          </div>
          <div className="sensor-detail-text">
            <div>Right LED : {leftSensor.ledStatus}</div>
            <div style={{ marginTop: '0.5rem' }}>Distance : {leftSensor.distance}</div>
            <div>Risk Percentage : {leftSensor.riskPercentage}</div>
            <div>
              Risk Level : <span className={leftSensor.riskLevel === 'LOW' ? 'risk-low' : 'risk-high'}>{leftSensor.riskLevel}</span>
            </div>
          </div>
        </div>

        {/* Right Sensor */}
        <div className="uturn-sub-column">
          <div className="sub-column-header" style={{ fontSize: '0.95rem', fontWeight: 800 }}>
            Right Sensor
          </div>
          <div className={`sensor-circle-badge ${rightSensor.status === 'SAFE' ? 'safe' : 'detected'}`}>
            <Radio size={28} />
          </div>
          <div className={`sensor-status-tag ${rightSensor.status === 'SAFE' ? 'safe' : 'detected'}`}>
            {rightSensor.status}
          </div>
          <div className="sensor-detail-text">
            <div>Left LED : {rightSensor.ledStatus}</div>
            <div style={{ marginTop: '0.5rem' }}>Distance : {rightSensor.distance}</div>
            <div>Risk Percentage : {rightSensor.riskPercentage}</div>
            <div>
              Risk Level : <span className={rightSensor.riskLevel === 'LOW' ? 'risk-low' : 'risk-high'}>{rightSensor.riskLevel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceUTurnCard;
