import React from 'react';
import { RotateCcw, CheckCircle2, PauseCircle, Wrench } from 'lucide-react';
import '../../../styles/uturnManagement.css';

const cardConfigs = [
  {
    key: 'totalUnits',
    label: 'Total U-Turn Units',
    subtext: 'All registered units',
    icon: RotateCcw,
    iconBg: '#EFF6FF',
    iconColor: '#0047FF',
    defaultValue: 48,
  },
  {
    key: 'activeUnits',
    label: 'Active Units',
    subtext: '70.8% of total',
    icon: CheckCircle2,
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    defaultValue: 34,
  },
  {
    key: 'inactiveUnits',
    label: 'Inactive Units',
    subtext: '16.7% of total',
    icon: PauseCircle,
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    defaultValue: 8,
  },
  {
    key: 'maintenanceUnits',
    label: 'Maintenance Units',
    subtext: '12.5% of total',
    icon: Wrench,
    iconBg: '#F5F3FF',
    iconColor: '#8B5CF6',
    defaultValue: 6,
  },
];

const UTurnSummaryCards = ({ stats = {} }) => {
  return (
    <div className="uturn-stats-grid">
      {cardConfigs.map((card) => {
        const Icon = card.icon;
        const val = stats[card.key] !== undefined ? stats[card.key] : card.defaultValue;
        return (
          <div className="uturn-stat-card" key={card.key}>
            <div
              className="uturn-stat-icon"
              style={{ background: card.iconBg, color: card.iconColor }}
            >
              <Icon size={22} />
            </div>
            <div className="uturn-stat-content">
              <span className="uturn-stat-label">{card.label}</span>
              <span className="uturn-stat-value">{val}</span>
              <span className="uturn-stat-subtext">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UTurnSummaryCards;
