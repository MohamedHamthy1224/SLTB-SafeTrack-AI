import React from 'react';
import { RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import '../../styles/uTurnAlerts.css';

export const UTurnAlertSummaryCards = ({ stats }) => {
  const defaultStats = stats || {
    total: 126,
    high: 54,
    medium: 42,
    low: 30
  };

  const statCards = [
    {
      title: 'Total U-Turn Alerts',
      value: defaultStats.total,
      icon: RotateCcw,
      bg: '#F3E8FF',
      color: '#A855F7',
      subtext: '↑ 8 vs yesterday',
      trend: 'up'
    },
    {
      title: 'High Risk Alerts',
      value: defaultStats.high,
      icon: AlertTriangle,
      bg: '#FEE2E2',
      color: '#EF4444',
      subtext: '↑ 6 vs yesterday',
      trend: 'up'
    },
    {
      title: 'Medium Risk Alerts',
      value: defaultStats.medium,
      icon: AlertTriangle,
      bg: '#FFF4E5',
      color: '#F97316',
      subtext: '↑ 2 vs yesterday',
      trend: 'up'
    },
    {
      title: 'Low Risk Alerts',
      value: defaultStats.low,
      icon: ShieldCheck,
      bg: '#E8F5E9',
      color: '#10B981',
      subtext: '↓ 4 vs yesterday',
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
              <span className={`stat-subtext ${card.trend === 'down' ? 'trend-down' : 'trend-up'}`}>
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
