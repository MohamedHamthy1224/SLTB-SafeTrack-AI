import React from 'react';
import { Bell, AlertTriangle, Activity, ShieldCheck } from 'lucide-react';
import '../../../styles/bus-alerts.css';

export const BusAlertStats = ({ stats }) => {
  const defaultStats = stats || {
    total: 36,
    high: 18,
    medium: 12,
    low: 6
  };

  const statCards = [
    {
      title: 'Total Bus Alerts',
      value: defaultStats.total,
      icon: Bell,
      bg: '#FEE2E2',
      color: '#EF4444'
    },
    {
      title: 'High Priority Alerts',
      value: defaultStats.high,
      icon: AlertTriangle,
      bg: '#FFF4E5',
      color: '#F97316'
    },
    {
      title: 'Medium Priority Alerts',
      value: defaultStats.medium,
      icon: Activity,
      bg: '#EEF2FF',
      color: '#4F46E5'
    },
    {
      title: 'Low Priority Alerts',
      value: defaultStats.low,
      icon: ShieldCheck,
      bg: '#E8F5E9',
      color: '#10B981'
    }
  ];

  return (
    <div className="bus-alerts-stats-grid">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div className="bus-alert-stat-card" key={card.title}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: card.bg, color: card.color }}>
              <Icon size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{card.title}</span>
              <span className="stat-number">{card.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BusAlertStats;
