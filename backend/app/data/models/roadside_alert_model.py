from app.data.database import db
from datetime import datetime, timezone
from app.data.models.roadside_unit_model import RoadsideUnitModel
from app.data.models.notification_model import NotificationModel
from app.data.models.sensor_data_model import SensorDataModel
from app.data.models.route_model import RouteModel
from app.data.models.device_registry_model import DeviceRegistryModel

class RoadsideAlertModel(db.Model):
    __tablename__ = 'roadside_alerts'
    __allow_unmapped__ = True

    roadside_alert_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    roadside_unit_id = db.Column(db.Integer, db.ForeignKey('roadside_units.roadside_unit_id'), nullable=False)
    device_id = db.Column(db.Integer, db.ForeignKey('device_registry.device_id'), nullable=False)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.route_id'), nullable=True)
    sensor_data_id = db.Column(db.Integer, db.ForeignKey('sensor_data.sensor_data_id'), nullable=True)
    alert_time = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=True)

    # Relationships
    roadside_unit = db.relationship('RoadsideUnitModel', backref='alerts', lazy=True)
    device = db.relationship('DeviceRegistryModel', backref='roadside_alerts', lazy=True)
    route = db.relationship('RouteModel', backref='roadside_alerts', lazy=True)
    sensor_data = db.relationship('SensorDataModel', backref='roadside_alerts', lazy=True)
    notifications = db.relationship('NotificationModel', backref='roadside_alert_ref', lazy=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        alert_time_str = None
        if self.alert_time:
            alert_time_str = self.alert_time.strftime('%Y-%m-%d %H:%M:%S')

        # Find linked notification if exists
        notification_title = None
        priority = None
        message = None
        if self.notifications:
            latest_notif = self.notifications[-1]
            notification_title = latest_notif.title
            priority = latest_notif.priority
            message = latest_notif.message

        return {
            'roadsideAlertId': self.roadside_alert_id,
            'roadside_alert_id': self.roadside_alert_id,
            'roadsideUnitId': self.roadside_unit_id,
            'roadside_unit_id': self.roadside_unit_id,
            'deviceId': self.device_id,
            'device_id': self.device_id,
            'routeId': self.route_id,
            'route_id': self.route_id,
            'sensorDataId': self.sensor_data_id,
            'sensor_data_id': self.sensor_data_id,
            'alertTime': alert_time_str,
            'alert_time': alert_time_str,
            'notificationTitle': notification_title or 'U-Turn Alert',
            'notification_title': notification_title or 'U-Turn Alert',
            'priority': priority or 'Medium',
            'message': message or '',
            'locationName': self.roadside_unit.location_name if self.roadside_unit else None
        }
