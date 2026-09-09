import React from 'react';
import { Shield, UserCheck, Lightbulb, Radio } from 'lucide-react';
import '../../styles/police-cards.css';

export const PoliceSafetyCard = ({ data }) => {
  const pir = data?.pir || { status: 'SAFE', buzzer: 'MUTE' };
  const ldr = data?.ldr || { status: 'SAFE', ledStatus: 'OFF' };
  const ultrasonic = data?.ultrasonic || {
    status: 'SAFE',
    distance: '—',
    distanceRisk: '0%',
    riskLevel: 'LOW',
    ledStatus: 'OFF'
  };

  return (
    <div className="police-monitor-card">
      <div className="monitor-card-header">
        <Shield size={22} className="monitor-card-header-icon" />
        <h3 className="monitor-card-title">Bus Safety Monitor</h3>
      </div>

      <div className="bus-safety-grid">
        {/* Sub Column 1: PIR Motion Detection */}
        <div className="safety-sub-column">
          <div className="sub-column-header">PIR Motion Detection</div>
          <div className={`sensor-circle-badge ${pir.status === 'SAFE' ? 'safe' : 'detected'}`}>
            <UserCheck size={28} />
          </div>
          <div className={`sensor-status-tag ${pir.status === 'SAFE' ? 'safe' : 'detected'}`}>
            {pir.status}
          </div>
          <p className="sensor-detail-text">
            Buzzer Status : {pir.buzzer}
          </p>
        </div>

        {/* Sub Column 2: LDR Light Detection */}
        <div className="safety-sub-column">
          <div className="sub-column-header">LDR Light Detection</div>
          <div className={`sensor-circle-badge ${ldr.status === 'SAFE' ? 'safe' : 'detected'}`}>
            <Lightbulb size={28} />
          </div>
          <div className={`sensor-status-tag ${ldr.status === 'SAFE' ? 'safe' : 'detected'}`}>
            {ldr.status}
          </div>
          <p className="sensor-detail-text">
            LDR LED Status : {ldr.ledStatus}
          </p>
        </div>

        {/* Sub Column 3: Ultrasonic Distance Monitoring */}
        <div className="safety-sub-column">
          <div className="sub-column-header">Ultrasonic Distance Monitoring</div>
          <div className={`sensor-circle-badge ${ultrasonic.status === 'SAFE' ? 'safe' : 'detected'}`}>
            <Radio size={28} />
          </div>
          <div className={`sensor-status-tag ${ultrasonic.status === 'SAFE' ? 'safe' : 'detected'}`}>
            {ultrasonic.status}
          </div>
          <div className="sensor-detail-text">
            <div>Distance : {ultrasonic.distance}</div>
            <div>Distance Risk : {ultrasonic.distanceRisk}</div>
            <div>
              Risk Level : <span className={ultrasonic.riskLevel === 'LOW' ? 'risk-low' : 'risk-high'}>{ultrasonic.riskLevel}</span>
            </div>
            <div>Ultrasonic LED Status : {ultrasonic.ledStatus}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceSafetyCard;
