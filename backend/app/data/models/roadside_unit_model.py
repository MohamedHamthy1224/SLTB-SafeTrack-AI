from app.data.database import db
from datetime import datetime, timezone

class RoadsideUnitModel(db.Model):
    __tablename__ = 'roadside_units'
    __allow_unmapped__ = True

    roadside_unit_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    device_id = db.Column(db.Integer, db.ForeignKey('device_registry.device_id'), nullable=False)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.route_id'), nullable=True)
    location_name = db.Column(db.String(150), nullable=False)
    latitude = db.Column(db.Numeric(10, 8), nullable=True)
    longitude = db.Column(db.Numeric(11, 8), nullable=True)
    installation_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.Enum('Active', 'Inactive', 'Maintenance'), default='Active')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    device = db.relationship('DeviceRegistryModel', backref='roadside_units', lazy=True)
    route = db.relationship('RouteModel', backref='roadside_units', lazy=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        inst_date_str = None
        if self.installation_date:
            inst_date_str = str(self.installation_date)

        created_at_str = None
        if self.created_at:
            created_at_str = self.created_at.strftime('%Y-%m-%d %H:%M:%S')

        return {
            'roadsideUnitId': self.roadside_unit_id,
            'roadside_unit_id': self.roadside_unit_id,
            'deviceId': self.device_id,
            'device_id': self.device_id,
            'routeId': self.route_id,
            'route_id': self.route_id,
            'locationName': self.location_name,
            'location_name': self.location_name,
            'latitude': str(self.latitude) if self.latitude is not None else None,
            'longitude': str(self.longitude) if self.longitude is not None else None,
            'installationDate': inst_date_str,
            'installation_date': inst_date_str,
            'status': self.status or 'Active',
            'createdAt': created_at_str,
            'created_at': created_at_str
        }
