from app.data.database import db
from datetime import datetime, timezone

class SensorDataModel(db.Model):
    __tablename__ = 'sensor_data'
    __allow_unmapped__ = True

    sensor_data_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    device_id = db.Column(db.Integer, db.ForeignKey('device_registry.device_id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.bus_id'), nullable=True)
    roadside_unit_id = db.Column(db.Integer, db.ForeignKey('roadside_units.roadside_unit_id'), nullable=True)
    pir_detection_status = db.Column(db.String(50), nullable=True)
    pir_buzzer_status = db.Column(db.SmallInteger, nullable=True)
    ldr_detection_status = db.Column(db.String(50), nullable=True)
    ldr_led_status = db.Column(db.SmallInteger, nullable=True)
    front_distance_cm = db.Column(db.Numeric(7, 2), nullable=True)
    front_risk_percentage = db.Column(db.Numeric(5, 2), nullable=True)
    front_risk_level = db.Column(db.String(50), nullable=True)
    front_led_status = db.Column(db.SmallInteger, nullable=True)
    front_detection_status = db.Column(db.String(50), nullable=True)
    right_distance_cm = db.Column(db.Numeric(7, 2), nullable=True)
    right_risk_percentage = db.Column(db.Numeric(5, 2), nullable=True)
    right_risk_level = db.Column(db.String(50), nullable=True)
    right_led_status = db.Column(db.SmallInteger, nullable=True)
    right_detection_status = db.Column(db.String(50), nullable=True)
    left_distance_cm = db.Column(db.Numeric(7, 2), nullable=True)
    left_risk_percentage = db.Column(db.Numeric(5, 2), nullable=True)
    left_risk_level = db.Column(db.String(50), nullable=True)
    left_led_status = db.Column(db.SmallInteger, nullable=True)
    left_detection_status = db.Column(db.String(50), nullable=True)
    device_timestamp = db.Column(db.DateTime, nullable=True)
    recorded_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            'sensor_data_id': self.sensor_data_id,
            'device_id': self.device_id,
            'bus_id': self.bus_id,
            'roadside_unit_id': self.roadside_unit_id,
            'pir_detection_status': self.pir_detection_status,
            'pir_buzzer_status': self.pir_buzzer_status,
            'ldr_detection_status': self.ldr_detection_status,
            'ldr_led_status': self.ldr_led_status,
            'front_distance_cm': float(self.front_distance_cm) if self.front_distance_cm is not None else None,
            'front_risk_percentage': float(self.front_risk_percentage) if self.front_risk_percentage is not None else None,
            'front_risk_level': self.front_risk_level,
            'front_led_status': self.front_led_status,
            'front_detection_status': self.front_detection_status,
            'right_distance_cm': float(self.right_distance_cm) if self.right_distance_cm is not None else None,
            'right_risk_percentage': float(self.right_risk_percentage) if self.right_risk_percentage is not None else None,
            'right_risk_level': self.right_risk_level,
            'right_led_status': self.right_led_status,
            'right_detection_status': self.right_detection_status,
            'left_distance_cm': float(self.left_distance_cm) if self.left_distance_cm is not None else None,
            'left_risk_percentage': float(self.left_risk_percentage) if self.left_risk_percentage is not None else None,
            'left_risk_level': self.left_risk_level,
            'left_led_status': self.left_led_status,
            'left_detection_status': self.left_detection_status,
            'device_timestamp': self.device_timestamp.strftime('%Y-%m-%d %H:%M:%S') if self.device_timestamp else None,
            'recorded_at': self.recorded_at.strftime('%Y-%m-%d %H:%M:%S') if self.recorded_at else None
        }
