from app.data.database import db
from datetime import datetime, timezone

class DriverModel(db.Model):
    __tablename__ = 'drivers'
    __allow_unmapped__ = True

    driver_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=True)
    gender = db.Column(db.Enum('Male', 'Female'), nullable=True)
    address = db.Column(db.Text, nullable=True)
    profile_picture = db.Column(db.String(255), nullable=True)
    license_number = db.Column(db.String(50), nullable=False, unique=True)
    issue_date = db.Column(db.Date, nullable=True)
    expiry_date = db.Column(db.Date, nullable=True)
    nic = db.Column(db.String(20), nullable=True, unique=True)
    phone = db.Column(db.String(20), nullable=True)
    alternative_phone_number = db.Column(db.String(20), nullable=True)
    email_address = db.Column(db.String(100), nullable=True)
    experience_years = db.Column(db.Integer, default=0)
    join_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.Enum('Active', 'Inactive'), default='Active')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)


    assignments = db.relationship('BusAssignmentModel', backref='driver', lazy=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            'driver_id': self.driver_id,
            'full_name': self.full_name,
            'date_of_birth': str(self.date_of_birth) if self.date_of_birth else None,
            'gender': self.gender,
            'address': self.address,
            'profile_picture': self.profile_picture,
            'license_number': self.license_number,
            'issue_date': str(self.issue_date) if self.issue_date else None,
            'expiry_date': str(self.expiry_date) if self.expiry_date else None,
            'nic': self.nic,
            'phone': self.phone,
            'alternative_phone_number': self.alternative_phone_number,
            'email_address': self.email_address,
            'experience_years': self.experience_years,
            'join_date': str(self.join_date) if self.join_date else None,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }

