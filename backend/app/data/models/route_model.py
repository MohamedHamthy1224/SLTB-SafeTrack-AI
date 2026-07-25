from app.data.database import db
from datetime import datetime

class RouteModel(db.Model):
    __tablename__ = 'routes'
    __allow_unmapped__ = True

    route_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    route_number = db.Column(db.String(20), nullable=False, unique=True)
    route_name = db.Column(db.String(150), nullable=False)
    start_location = db.Column(db.String(100), nullable=False)
    end_location = db.Column(db.String(100), nullable=False)
    distance_km = db.Column(db.Numeric(6, 2), nullable=True)
    estimated_duration = db.Column(db.Integer, nullable=True)
    status = db.Column(db.Enum('Active', 'Inactive'), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    assignments = db.relationship('BusAssignmentModel', backref='route', lazy=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            'route_id': self.route_id,
            'route_number': self.route_number,
            'route_name': self.route_name,
            'start_location': self.start_location,
            'end_location': self.end_location,
            'distance_km': float(self.distance_km) if self.distance_km is not None else None,
            'estimated_duration': self.estimated_duration,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
