from app.data.database import db
from datetime import datetime, timezone

class BusDeviceModel(db.Model):
    __tablename__ = 'bus_devices'
    __allow_unmapped__ = True

    bus_device_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.bus_id'), nullable=False)
    device_id = db.Column(db.Integer, db.ForeignKey('device_registry.device_id'), nullable=False)
    installation_location = db.Column(db.String(100), nullable=True)
    installed_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.Enum('Active', 'Inactive', 'Removed'), default='Active')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    bus = db.relationship('BusModel', backref='bus_devices_list', lazy=True)
    device = db.relationship('DeviceRegistryModel', back_populates='bus_devices', lazy=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        inst_date_str = None
        if self.installed_date:
            inst_date_str = str(self.installed_date)

        created_at_str = None
        if self.created_at:
            created_at_str = self.created_at.strftime('%Y-%m-%d %H:%M:%S')

        bus_number = None
        registration_number = None
        if self.bus:
            bus_number = self.bus.bus_number
            registration_number = self.bus.registration_number

        return {
            'busDeviceId': self.bus_device_id,
            'bus_device_id': self.bus_device_id,
            'busId': self.bus_id,
            'bus_id': self.bus_id,
            'busNumber': bus_number or '',
            'bus_number': bus_number or '',
            'registrationNumber': registration_number or '',
            'registration_number': registration_number or '',
            'deviceId': self.device_id,
            'device_id': self.device_id,
            'installationLocation': self.installation_location or '',
            'installation_location': self.installation_location or '',
            'installedDate': inst_date_str or '',
            'installed_date': inst_date_str or '',
            'status': self.status or 'Active',
            'createdAt': created_at_str or '',
            'created_at': created_at_str or ''
        }
