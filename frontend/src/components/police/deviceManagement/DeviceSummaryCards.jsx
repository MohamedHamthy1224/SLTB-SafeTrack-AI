import React from 'react';
import { Monitor, Bus, Radio, Wifi, Wrench } from 'lucide-react';
import '../../../styles/policeDeviceManagement.css';

export const DeviceSummaryCards = ({ stats }) => {
  const total = stats?.total ?? 0;
  const busUnits = stats?.busUnits ?? 0;
  const roadsideUnits = stats?.roadsideUnits ?? 0;
  const online = stats?.online ?? 0;
  const maintenance = stats?.maintenance ?? 0;

  const busPct = total > 0 ? ((busUnits / total) * 100).toFixed(1) : '0.0';
  const roadsidePct = total > 0 ? ((roadsideUnits / total) * 100).toFixed(1) : '0.0';
  const onlinePct = total > 0 ? ((online / total) * 100).toFixed(1) : '0.0';
  const maintPct = total > 0 ? ((maintenance / total) * 100).toFixed(1) : '0.0';

  const cards = [
    {
      label: 'Total Devices',
      value: total,
      desc: 'All registered devices',
      icon: Monitor,
      iconBg: '#EFF6FF',
      iconColor: '#3B82F6',
    },
    {
      label: 'Bus Units',
      value: busUnits,
      desc: `${busPct}% of total`,
      icon: Bus,
      iconBg: '#EFF6FF',
      iconColor: '#0047FF',
    },
    {
      label: 'Roadside Units',
      value: roadsideUnits,
      desc: `${roadsidePct}% of total`,
      icon: Radio,
      iconBg: '#F5F3FF',
      iconColor: '#8B5CF6',
    },
    {
      label: 'Online Devices',
      value: online,
      desc: `${onlinePct}% of total`,
      icon: Wifi,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
    },
    {
      label: 'Maintenance Devices',
      value: maintenance,
      desc: `${maintPct}% of total`,
      icon: Wrench,
      iconBg: '#FFF7ED',
      iconColor: '#EA580C',
    },
  ];

  return (
    <div className="device-stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div className="device-stat-card" key={card.label}>
            <div
              className="device-stat-icon"
              style={{ background: card.iconBg, color: card.iconColor }}
            >
              <Icon size={20} />
            </div>
            <div className="device-stat-content">
              <span className="device-stat-label">{card.label}</span>
              <span className="device-stat-value">{card.value}</span>
              <span className="device-stat-desc">{card.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeviceSummaryCards;
