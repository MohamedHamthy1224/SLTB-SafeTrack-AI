import React from 'react';
import { RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import '../../styles/uTurnAlerts.css';

export const UTurnAlertSummaryCards = ({ stats }) => {
  const currentStats = stats || {
    total: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  const statCards = [
    {
      title: 'Total U-Turn Alerts',
      value: currentStats.total ?? currentStats.totalAlerts ?? 0,
      icon: RotateCcw,
      bg: '#F3E8FF',
      color: '#A855F7',
      subtext: 'All recorded incidents',
      trend: 'up'
    },
    {
      title: 'High Risk Alerts',
      value: currentStats.high ?? currentStats.highAlerts ?? 0,
      icon: AlertTriangle,
      bg: '#FEE2E2',
      color: '#EF4444',
      subtext: 'Critical safety violations',
      trend: 'up'
    },
    {
      title: 'Medium Risk Alerts',
      value: currentStats.medium ?? currentStats.mediumAlerts ?? 0,
      icon: AlertTriangle,
      bg: '#FFF4E5',
      color: '#F97316',
      subtext: 'Moderate safety warnings',
      trend: 'up'
    },
    {
      title: 'Low Risk Alerts',
      value: currentStats.low ?? currentStats.lowAlerts ?? 0,
      icon: ShieldCheck,
      bg: '#E8F5E9',
      color: '#10B981',
      subtext: 'Minor route advisories',
      trend: 'down'
    }
  ];

  return (
    <div className="uturn-alerts-stats-grid">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div className="uturn-alert-stat-card" key={card.title}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: card.bg, color: card.color }}>
              <Icon size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{card.title}</span>
              <span className="stat-number">{card.value}</span>
              <span className="stat-subtext">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UTurnAlertSummaryCards;
