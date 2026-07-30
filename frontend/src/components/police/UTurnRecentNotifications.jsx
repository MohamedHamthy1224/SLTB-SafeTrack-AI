import React from 'react';
import { Bell, AlertTriangle, ShieldAlert } from 'lucide-react';
import '../../styles/uTurnAlerts.css';

const priorityIconMap = {
  High: { icon: AlertTriangle, bg: '#FEE2E2', color: '#EF4444' },
  Medium: { icon: ShieldAlert, bg: '#FFF4E5', color: '#F97316' },
  Low: { icon: Bell, bg: '#E8F5E9', color: '#10B981' },
};

const UTurnRecentNotifications = ({ notifications }) => {
  const items = notifications || [
    { id: 1, title: 'High U-Turn Alert', desc: 'Unsafe U-Turn at Kandy Road junction', time: '2 min ago', priority: 'High' },
    { id: 2, title: 'Medium U-Turn Alert', desc: 'U-Turn violation at Baseline Road', time: '18 min ago', priority: 'Medium' },
    { id: 3, title: 'High U-Turn Alert', desc: 'Dangerous U-Turn near School Zone', time: '42 min ago', priority: 'High' },
    { id: 4, title: 'Low U-Turn Alert', desc: 'U-Turn detected at permitted zone', time: '1 hr ago', priority: 'Low' },
    { id: 5, title: 'Medium U-Turn Alert', desc: 'Near-miss event on Highway A9', time: '1.5 hr ago', priority: 'Medium' },
  ];

  return (
    <div className="right-widget-card">
      <div className="widget-card-header">
        <h4 className="widget-card-title">Recent Notifications</h4>
        <span className="widget-card-subtitle">{items.length} latest</span>
      </div>
      <div className="recent-notifications-list">
        {items.map((item) => {
          const config = priorityIconMap[item.priority] || priorityIconMap.Low;
          const Icon = config.icon;
          return (
            <div className="notification-item" key={item.id}>
              <div
                className="notification-icon-badge"
                style={{ background: config.bg, color: config.color }}
              >
                <Icon size={14} />
              </div>
              <div className="notification-content">
                <div className="notification-title-row">
                  <span className="notification-item-title">{item.title}</span>
                  <span className="notification-time">{item.time}</span>
                </div>
                <p className="notification-item-desc">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UTurnRecentNotifications;
