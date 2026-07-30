import React from 'react';
import { Shield, UserCheck, Building2, Users } from 'lucide-react';
import '../../../styles/userManagement.css';

const summaryCardsData = [
  {
    key: 'policeAdminUsers',
    label: 'Police Admin Users',
    icon: Shield,
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    defaultValue: 3,
  },
  {
    key: 'trafficPoliceOfficers',
    label: 'Traffic Police Officers',
    icon: UserCheck,
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    defaultValue: 3,
  },
  {
    key: 'sltbAdminUsers',
    label: 'SLTB Admin Users',
    icon: Building2,
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    defaultValue: 3,
  },
  {
    key: 'totalUsers',
    label: 'Total Users',
    icon: Users,
    iconBg: '#F5F3FF',
    iconColor: '#8B5CF6',
    defaultValue: 9,
  },
];

const UserSummaryCards = ({ stats }) => {
  return (
    <div className="user-stats-grid">
      {summaryCardsData.map((card) => {
        const Icon = card.icon;
        const value = stats?.[card.key] ?? card.defaultValue;
        return (
          <div className="user-stat-card" key={card.key}>
            <div
              className="user-stat-icon"
              style={{ background: card.iconBg, color: card.iconColor }}
            >
              <Icon size={20} />
            </div>
            <div className="user-stat-content">
              <span className="user-stat-label">{card.label}</span>
              <span className="user-stat-value">{value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserSummaryCards;
