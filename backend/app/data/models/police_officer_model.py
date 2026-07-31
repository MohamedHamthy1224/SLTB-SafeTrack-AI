from app.data.database import db
from datetime import datetime, date

class PoliceOfficerModel(db.Model):
    __tablename__ = 'police_officers'

    officer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False, unique=True)
    full_name = db.Column(db.String(100), nullable=False)
    badge_number = db.Column(db.String(50), nullable=False, unique=True)
    rank = db.Column(db.String(50), nullable=True)
    police_station = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    joined_date = db.Column(db.Date, nullable=True)
    device_token = db.Column(db.Text, nullable=True)
    is_online = db.Column(db.Boolean, default=False)
    last_active = db.Column(db.DateTime, nullable=True)

    def __init__(
        self,
        user_id=None,
        full_name=None,
        badge_number=None,
        rank=None,
        police_station=None,
        phone=None,
        joined_date=None,
        device_token=None,
        is_online=False,
        last_active=None,
        **kwargs
    ):
        super().__init__(**kwargs)
        if user_id is not None:
            self.user_id = user_id
        if full_name is not None:
            self.full_name = full_name
        if badge_number is not None:
            self.badge_number = badge_number
        if rank is not None:
            self.rank = rank
        if police_station is not None:
            self.police_station = police_station
        if phone is not None:
            self.phone = phone
        if joined_date is not None:
            self.joined_date = joined_date
        if device_token is not None:
            self.device_token = device_token
        if is_online is not None:
            self.is_online = is_online
        if last_active is not None:
            self.last_active = last_active

    def to_dict(self):
        return {
            'officer_id': self.officer_id,
            'officerId': self.officer_id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'fullName': self.full_name,
            'badge_number': self.badge_number,
            'badgeNumber': self.badge_number,
            'rank': self.rank,
            'police_station': self.police_station,
            'policeStation': self.police_station,
            'phone': self.phone,
            'joined_date': str(self.joined_date) if self.joined_date else None,
            'joinedDate': str(self.joined_date) if self.joined_date else None,
            'device_token': self.device_token,
            'deviceToken': self.device_token,
            'is_online': bool(self.is_online),
            'isOnline': 'Online' if self.is_online else 'Offline',
            'last_active': self.last_active.strftime('%Y-%m-%d %H:%M:%S') if self.last_active else None,
            'lastActive': self.last_active.strftime('%Y-%m-%d %H:%M:%S') if self.last_active else None,
        }
