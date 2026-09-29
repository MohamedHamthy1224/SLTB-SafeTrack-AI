import React from 'react';
import { RotateCcw, CheckCircle2, PauseCircle, Wrench } from 'lucide-react';
import '../../../styles/uturnManagement.css';

export const UTurnSummaryCards = ({ stats = {} }) => {
  const total = Number(stats.totalUnits ?? stats.total ?? 0);
  const active = Number(stats.activeUnits ?? stats.active ?? 0);
  const inactive = Number(stats.inactiveUnits ?? stats.inactive ?? 0);
  const maintenance = Number(stats.maintenanceUnits ?? stats.maintenance ?? 0);

  const activePct = total > 0 ? ((active / total) * 100).toFixed(1) : '0.0';
  const inactivePct = total > 0 ? ((inactive / total) * 100).toFixed(1) : '0.0';
  const maintPct = total > 0 ? ((maintenance / total) * 100).toFixed(1) : '0.0';

  const cards = [
    {
      key: 'totalUnits',
      label: 'Total U-Turn Units',
      value: total,
      subtext: 'All registered units',
      icon: RotateCcw,
      iconBg: '#EFF6FF',
      iconColor: '#0047FF',
    },
    {
      key: 'activeUnits',
      label: 'Active Units',
      value: active,
      subtext: `${activePct}% of total`,
      icon: CheckCircle2,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
    },
    {
      key: 'inactiveUnits',
      label: 'Inactive Units',
      value: inactive,
      subtext: `${inactivePct}% of total`,
      icon: PauseCircle,
      iconBg: '#FFF7ED',
      iconColor: '#EA580C',
    },
    {
      key: 'maintenanceUnits',
      label: 'Maintenance Units',
      value: maintenance,
      subtext: `${maintPct}% of total`,
      icon: Wrench,
      iconBg: '#F5F3FF',
      iconColor: '#8B5CF6',
    },
  ];

  return (
    <div className="uturn-stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;
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
              <span className="uturn-stat-value">{card.value}</span>
              <span className="uturn-stat-subtext">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UTurnSummaryCards;
