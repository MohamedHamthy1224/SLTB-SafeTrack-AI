from app.data.database import db
from datetime import datetime, timezone

class BusModel(db.Model):
    __tablename__ = 'buses'
    __allow_unmapped__ = True

    bus_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    registration_number = db.Column(db.String(20), nullable=False, unique=True)
    bus_number = db.Column(db.String(30), nullable=False, unique=True)
    service_type = db.Column(db.String(50), nullable=True)
    depot = db.Column(db.String(100), nullable=True)
    model = db.Column(db.String(100), nullable=True)
    chassis_number = db.Column(db.String(50), nullable=True, unique=True)
    engine_number = db.Column(db.String(50), nullable=True, unique=True)
    capacity = db.Column(db.Integer, nullable=True, default=0)
    standing_capacity = db.Column(db.Integer, nullable=True, default=0)
    fuel_type = db.Column(db.String(30), nullable=True)
    manufacture_year = db.Column(db.String(4), nullable=True)
    status = db.Column(db.Enum('Active', 'Maintenance', 'Inactive'), default='Active')
    registration_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    assignments = db.relationship('BusAssignmentModel', backref='bus', lazy=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @property
    def total_capacity(self):
        seating = self.capacity or 0
        standing = self.standing_capacity or 0
        return seating + standing

    def to_dict(self):
        reg_date_str = None
        if hasattr(self, 'registration_date') and self.registration_date:
            reg_date_str = str(self.registration_date)
        elif self.created_at:
            reg_date_str = self.created_at.strftime('%Y-%m-%d')

        return {
            'bus_id': self.bus_id,
            'registration_number': self.registration_number,
            'bus_number': self.bus_number,
            'service_type': self.service_type,
            'depot': self.depot,
            'model': self.model,
            'chassis_number': self.chassis_number,
            'engine_number': self.engine_number,
            'capacity': self.capacity or 0,
            'standing_capacity': self.standing_capacity or 0,
            'total_capacity': self.total_capacity,
            'fuel_type': self.fuel_type,
            'manufacture_year': str(self.manufacture_year) if self.manufacture_year else None,
            'status': self.status,
            'registration_date': reg_date_str,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
