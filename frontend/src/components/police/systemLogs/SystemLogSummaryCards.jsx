import React from 'react';
import { Activity, Users, CalendarDays, BarChart3 } from 'lucide-react';
import '../../../styles/systemLogs.css';

const cards = [
  {
    label: 'Total Activities',
    key: 'totalActivities',
    icon: Activity,
    iconBg: '#EFF6FF',
    iconColor: '#3B82F6',
    descKey: 'totalDesc',
    defaultDesc: 'All time activities',
  },
  {
    label: 'Unique Users',
    key: 'uniqueUsers',
    icon: Users,
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    descKey: 'uniqueDesc',
    defaultDesc: 'Users with activities',
  },
  {
    label: "Today's Activities",
    key: 'todayActivities',
    icon: CalendarDays,
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    descKey: 'todayDate',
    defaultDesc: '05 Jun 2025',
  },
  {
    label: "This Week's Activities",
    key: 'weekActivities',
    icon: BarChart3,
    iconBg: '#F5F3FF',
    iconColor: '#8B5CF6',
    descKey: 'weekRange',
    defaultDesc: '01 Jun - 07 Jun 2025',
  },
];

const formatNumber = (n) =>
  n !== undefined && n !== null
    ? n.toLocaleString('en-US')
    : '—';

const SystemLogSummaryCards = ({ stats }) => {
  return (
    <div className="syslog-stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        const desc = stats?.[card.descKey] ?? card.defaultDesc;
        return (
          <div className="syslog-stat-card" key={card.key}>
            <div
              className="syslog-stat-icon"
              style={{ background: card.iconBg, color: card.iconColor }}
            >
              <Icon size={20} />
            </div>
            <div className="syslog-stat-content">
              <span className="syslog-stat-label">{card.label}</span>
              <span className="syslog-stat-value">
                {formatNumber(stats?.[card.key])}
              </span>
              <span className="syslog-stat-desc">{desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SystemLogSummaryCards;
