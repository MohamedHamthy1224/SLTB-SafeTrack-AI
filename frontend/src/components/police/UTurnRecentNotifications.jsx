import React from 'react';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import '../../styles/uTurnAlerts.css';

const priorityIconMap = {
  High: { icon: AlertTriangle, bg: '#FEE2E2', color: '#EF4444' },
  Medium: { icon: ShieldAlert, bg: '#FFF4E5', color: '#F97316' },
  Low: { icon: Bell, bg: '#E8F5E9', color: '#10B981' },
};

const UTurnRecentNotifications = ({ notifications = [] }) => {
  const items = notifications || [];

  return (
    <div className="right-widget-card">
      <div className="widget-card-header">
        <h4 className="widget-card-title">Recent Notifications</h4>
        <span className="widget-card-subtitle">{items.length} latest</span>
      </div>
      <div className="recent-notifications-list">
        {items.length > 0 ? (
          items.map((item, idx) => {
            const priorityVal = item.priority || 'Medium';
            const config = priorityIconMap[priorityVal] || priorityIconMap.Low;
            const Icon = config.icon;
            const itemId = item.id || item.notificationId || `notif-${idx}`;
            const timeDisplay = item.time || item.createdAt || '';
            const descDisplay = item.desc || item.message || '';

            return (
              <div className="notification-item" key={itemId}>
                <div
                  className="notification-icon-badge"
                  style={{ background: config.bg, color: config.color }}
                >
                  <Icon size={14} />
                </div>
                <div className="notification-content">
                  <div className="notification-title-row">
                    <span className="notification-item-title">{item.title}</span>
                    {timeDisplay && <span className="notification-time">{timeDisplay}</span>}
                  </div>
                  {descDisplay && <p className="notification-item-desc">{descDisplay}</p>}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem', color: '#94a3b8' }}>
            <CheckCircle2 size={22} color="#cbd5e1" style={{ margin: '0 auto 0.4rem auto' }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>No recent notifications</div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Real-time updates will appear here automatically.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UTurnRecentNotifications;
