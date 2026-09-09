from app.data.database import db
from datetime import datetime, timezone

class DeviceRegistryModel(db.Model):
    __tablename__ = 'device_registry'
    __allow_unmapped__ = True

    device_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    device_code = db.Column(db.String(50), nullable=False, unique=True)
    device_name = db.Column(db.String(100), nullable=False)
    device_type = db.Column(db.Enum('Bus Unit', 'Roadside Unit'), nullable=False)
    mac_address = db.Column(db.String(50), unique=True, nullable=True)
    ip_address = db.Column(db.String(50), nullable=True)
    firmware_version = db.Column(db.String(30), nullable=True)
    installation_date = db.Column(db.Date, nullable=True)
    last_seen = db.Column(db.DateTime, nullable=True)
    is_online = db.Column(db.Boolean, default=False)
    status = db.Column(db.Enum('Active', 'Inactive', 'Maintenance'), default='Active')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    bus_devices = db.relationship('BusDeviceModel', back_populates='device', cascade='all, delete-orphan', lazy=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        inst_date_str = None
        if self.installation_date:
            inst_date_str = str(self.installation_date)

        last_seen_str = None
        if self.last_seen:
            last_seen_str = self.last_seen.strftime('%Y-%m-%d %H:%M:%S')

        created_at_str = None
        if self.created_at:
            created_at_str = self.created_at.strftime('%Y-%m-%d %H:%M:%S')

        return {
            'deviceId': self.device_id,
            'device_id': self.device_id,
            'deviceCode': self.device_code,
            'device_code': self.device_code,
            'deviceName': self.device_name,
            'device_name': self.device_name,
            'deviceType': self.device_type,
            'device_type': self.device_type,
            'macAddress': self.mac_address or '',
            'mac_address': self.mac_address or '',
            'ipAddress': self.ip_address or '',
            'ip_address': self.ip_address or '',
            'firmwareVersion': self.firmware_version or '',
            'firmware_version': self.firmware_version or '',
            'installationDate': inst_date_str or '',
            'installation_date': inst_date_str or '',
            'lastSeen': last_seen_str or '',
            'last_seen': last_seen_str or '',
            'isOnline': bool(self.is_online),
            'is_online': bool(self.is_online),
            'status': self.status or 'Active',
            'createdAt': created_at_str or '',
            'created_at': created_at_str or ''
        }
