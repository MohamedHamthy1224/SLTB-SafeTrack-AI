import React from 'react';
import { Monitor, Bus, Radio, Wifi, Wrench } from 'lucide-react';
import '../../../styles/deviceManagement.css';

const cards = [
  {
    label: 'Total Devices',
    key: 'total',
    icon: Monitor,
    iconBg: '#EFF6FF',
    iconColor: '#3B82F6',
    desc: 'All registered devices',
  },
  {
    label: 'Bus Units',
    key: 'busUnits',
    icon: Bus,
    iconBg: '#EFF6FF',
    iconColor: '#0047ff',
    desc: '58.1% of total',
  },
  {
    label: 'Roadside Units',
    key: 'roadsideUnits',
    icon: Radio,
    iconBg: '#F5F3FF',
    iconColor: '#8B5CF6',
    desc: '41.9% of total',
  },
  {
    label: 'Online Devices',
    key: 'online',
    icon: Wifi,
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    desc: '75.7% of total',
  },
  {
    label: 'Maintenance Devices',
    key: 'maintenance',
    icon: Wrench,
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    desc: '7.4% of total',
  },
];

const DeviceSummaryCards = ({ stats }) => {
  return (
    <div className="device-stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div className="device-stat-card" key={card.key}>
            <div
              className="device-stat-icon"
              style={{ background: card.iconBg, color: card.iconColor }}
            >
              <Icon size={20} />
            </div>
            <div className="device-stat-content">
              <span className="device-stat-label">{card.label}</span>
              <span className="device-stat-value">{stats?.[card.key] ?? '—'}</span>
              <span className="device-stat-desc">{card.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeviceSummaryCards;
