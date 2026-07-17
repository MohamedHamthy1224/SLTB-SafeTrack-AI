from app.data.database import db
from datetime import datetime

class BusModel(db.Model):
    __tablename__ = 'buses'

    bus_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    registration_number = db.Column(db.String(20), nullable=False, unique=True)
    bus_number = db.Column(db.String(30), nullable=False, unique=True)
    depot = db.Column(db.String(100), nullable=True)
    model = db.Column(db.String(100), nullable=True)
    capacity = db.Column(db.Integer, nullable=True)
    manufacture_year = db.Column(db.String(4), nullable=True)
    status = db.Column(db.Enum('Active', 'Maintenance', 'Inactive'), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    assignments = db.relationship('BusAssignmentModel', backref='bus', lazy=True)

    def to_dict(self):
        return {
            'bus_id': self.bus_id,
            'registration_number': self.registration_number,
            'bus_number': self.bus_number,
            'depot': self.depot,
            'model': self.model,
            'capacity': self.capacity,
            'manufacture_year': str(self.manufacture_year) if self.manufacture_year else None,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
