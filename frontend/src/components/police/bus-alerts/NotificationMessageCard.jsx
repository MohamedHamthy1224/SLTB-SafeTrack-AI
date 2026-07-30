import React from 'react';
import { AlertTriangle } from 'lucide-react';
import '../../../styles/view-bus-alert.css';

export const NotificationMessageCard = ({ notificationTitle, priority, description, actionRequired }) => {
  const title = notificationTitle || 'Forward Object Detected';
  const priorityText = priority || 'High';
  const desc = description || 'The system has identified a potential collision risk based on the object\'s proximity to the vehicle. Minimum safe distance has been violated.';
  const note = actionRequired || 'Please take immediate action to ensure passenger safety. This is an automated message from SLTB SafeTrack AI.';

  return (
    <div className="notification-card-fullwidth">
      <h3 className="notification-card-title">Notification Message</h3>

      <div className="warning-message-box-banner">
        <div className="warning-icon-wrapper-banner">
          <AlertTriangle size={28} />
        </div>

        <div className="warning-content-wrapper">
          <div className="warning-title-row">
            <h2 className="warning-title-banner">{title}</h2>
            <span className="priority-badge high">{priorityText}</span>
          </div>

          <p className="warning-description-banner">{desc}</p>

          <p className="warning-action-note-banner">{note}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationMessageCard;
