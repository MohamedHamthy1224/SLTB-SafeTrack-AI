from app.data.database import db
from datetime import datetime

class SensorDataModel(db.Model):
    __tablename__ = 'sensor_data'

    sensor_data_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    device_id = db.Column(db.Integer, db.ForeignKey('device_registry.device_id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.bus_id'), nullable=True)
    roadside_unit_id = db.Column(db.Integer, db.ForeignKey('roadside_units.roadside_unit_id'), nullable=True)
    pir_status = db.Column(db.Boolean, nullable=True)
    ldr_status = db.Column(db.Boolean, nullable=True)
    front_distance = db.Column(db.Numeric(6, 2), nullable=True)
    right_distance = db.Column(db.Numeric(6, 2), nullable=True)
    left_distance = db.Column(db.Numeric(6, 2), nullable=True)
    red_led_status = db.Column(db.Boolean, default=False)
    green_led_status = db.Column(db.Boolean, default=False)
    buzzer_status = db.Column(db.Boolean, default=False)
    device_timestamp = db.Column(db.DateTime, nullable=True)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    front_approach_speed_kmh = db.Column(db.Numeric(6, 2), nullable=True)
    right_approach_speed_kmh = db.Column(db.Numeric(6, 2), nullable=True)
    left_approach_speed_kmh = db.Column(db.Numeric(6, 2), nullable=True)

    def to_dict(self):
        return {
            'sensor_data_id': self.sensor_data_id,
            'device_id': self.device_id,
            'bus_id': self.bus_id,
            'roadside_unit_id': self.roadside_unit_id,
            'pir_status': bool(self.pir_status) if self.pir_status is not None else None,
            'ldr_status': bool(self.ldr_status) if self.ldr_status is not None else None,
            'front_distance': float(self.front_distance) if self.front_distance is not None else None,
            'right_distance': float(self.right_distance) if self.right_distance is not None else None,
            'left_distance': float(self.left_distance) if self.left_distance is not None else None,
            'red_led_status': bool(self.red_led_status),
            'green_led_status': bool(self.green_led_status),
            'buzzer_status': bool(self.buzzer_status),
            'device_timestamp': self.device_timestamp.strftime('%Y-%m-%d %H:%M:%S') if self.device_timestamp else None,
            'recorded_at': self.recorded_at.strftime('%Y-%m-%d %H:%M:%S') if self.recorded_at else None,
            'front_approach_speed_kmh': float(self.front_approach_speed_kmh) if self.front_approach_speed_kmh is not None else None,
            'right_approach_speed_kmh': float(self.right_approach_speed_kmh) if self.right_approach_speed_kmh is not None else None,
            'left_approach_speed_kmh': float(self.left_approach_speed_kmh) if self.left_approach_speed_kmh is not None else None
        }
