from app.data.database import db
from datetime import datetime, timezone

class BusAlertModel(db.Model):
    __tablename__ = 'bus_alerts'
    __allow_unmapped__ = True

    bus_alert_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.bus_id'), nullable=False)
    device_id = db.Column(db.Integer, db.ForeignKey('device_registry.device_id'), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey('bus_assignments.assignment_id'), nullable=True)
    sensor_data_id = db.Column(db.Integer, db.ForeignKey('sensor_data.sensor_data_id'), nullable=True)
    alert_time = db.Column(db.DateTime, nullable=True, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'bus_alert_id': self.bus_alert_id,
            'bus_id': self.bus_id,
            'device_id': self.device_id,
            'assignment_id': self.assignment_id,
            'sensor_data_id': self.sensor_data_id,
            'alert_time': self.alert_time.strftime('%Y-%m-%d %H:%M:%S') if self.alert_time else None
        }
