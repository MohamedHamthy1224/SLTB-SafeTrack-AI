import React from 'react';
import { AlertTriangle, Lightbulb, Radio, MoveHorizontal } from 'lucide-react';
import '../../../styles/bus-alerts.css';

export const RecentNotifications = ({ notifications }) => {
  const items = notifications && Array.isArray(notifications) ? notifications : [];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'headlight':
        return { icon: Lightbulb, bg: '#FFF4E5', color: '#F97316' };
      case 'motion':
        return { icon: Radio, bg: '#E8F5E9', color: '#10B981' };
      case 'distance':
        return { icon: MoveHorizontal, bg: '#FFF4E5', color: '#F97316' };
      case 'alert':
      default:
        return { icon: AlertTriangle, bg: '#FEE2E2', color: '#EF4444' };
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (String(priority).toLowerCase()) {
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return 'low';
    }
  };

  return (
    <div className="right-widget-card">
      <div className="widget-card-header" style={{ marginBottom: '0.85rem' }}>
        <h4 className="widget-card-title">Recent Notifications</h4>
      </div>

      <div className="recent-notifications-list">
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#94A3B8', fontSize: '0.85rem' }}>
            No recent notifications.
          </div>
        ) : (
          items.map((item) => {
          const config = getNotificationIcon(item.type);
          const Icon = config.icon;
          return (
            <div className="notification-item" key={item.id}>
              <div 
                className="notification-icon-badge" 
                style={{ backgroundColor: config.bg, color: config.color }}
              >
                <Icon size={16} />
              </div>

              <div className="notification-content">
                <div className="notification-title-row">
                  <span className="notification-item-title">{item.title}</span>
                  <span className={`priority-badge ${getPriorityBadgeClass(item.priority)}`} style={{ fontSize: '0.685rem', padding: '0.15rem 0.45rem' }}>
                    {item.priority}
                  </span>
                </div>
                <p className="notification-item-desc">{item.desc}</p>
              </div>

              <span className="notification-time">{item.time}</span>
            </div>
          );
        }))}
      </div>
    </div>
  );
};

export default RecentNotifications;
