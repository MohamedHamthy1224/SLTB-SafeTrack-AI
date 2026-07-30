import React from 'react';
import '../../../styles/systemLogs.css';

const RecentActivitiesCard = ({ activities }) => {
  return (
    <div className="syslog-analytics-card">
      <h4 className="syslog-analytics-card-title">Recent Activities</h4>

      <div className="syslog-recent-list">
        {activities.map((item, idx) => (
          <div className="syslog-recent-item" key={idx}>
            <div className="syslog-recent-info">
              <span className="syslog-recent-activity">{item.activity}</span>
              <span className="syslog-recent-user">by {item.user}</span>
            </div>
            <span className="syslog-recent-time">{item.time}</span>
          </div>
        ))}
      </div>

      <button className="btn-view-all-activities">
        View All Activities
      </button>
    </div>
  );
};

export default RecentActivitiesCard;
