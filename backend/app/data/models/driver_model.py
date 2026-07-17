from app.data.database import db
from datetime import datetime

class DriverModel(db.Model):
    __tablename__ = 'drivers'

    driver_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(50), nullable=False, unique=True)
    nic = db.Column(db.String(20), nullable=True, unique=True)
    phone = db.Column(db.String(20), nullable=True)
    experience_years = db.Column(db.Integer, default=0)
    status = db.Column(db.Enum('Active', 'Inactive'), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    assignments = db.relationship('BusAssignmentModel', backref='driver', lazy=True)

    def to_dict(self):
        return {
            'driver_id': self.driver_id,
            'full_name': self.full_name,
            'license_number': self.license_number,
            'nic': self.nic,
            'phone': self.phone,
            'experience_years': self.experience_years,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
