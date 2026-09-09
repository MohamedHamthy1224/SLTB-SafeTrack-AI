from app.data.database import db
from datetime import datetime, timezone

class NotificationModel(db.Model):
    __tablename__ = 'notifications'
    __allow_unmapped__ = True

    notification_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    priority = db.Column(db.Enum('Low', 'Medium', 'High'), default='Medium', nullable=False)
    bus_alert_id = db.Column(db.Integer, db.ForeignKey('bus_alerts.bus_alert_id'), nullable=True)
    roadside_alert_id = db.Column(db.Integer, db.ForeignKey('roadside_alerts.roadside_alert_id'), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        created_at_str = None
        if self.created_at:
            created_at_str = self.created_at.strftime('%Y-%m-%d %H:%M:%S')

        return {
            'notificationId': self.notification_id,
            'notification_id': self.notification_id,
            'title': self.title,
            'message': self.message,
            'priority': self.priority or 'Medium',
            'busAlertId': self.bus_alert_id,
            'bus_alert_id': self.bus_alert_id,
            'roadsideAlertId': self.roadside_alert_id,
            'roadside_alert_id': self.roadside_alert_id,
            'createdAt': created_at_str,
            'created_at': created_at_str
        }
