from app.data.database import db
from datetime import datetime, timezone

def _utc_now():
    return datetime.now(timezone.utc)

class UserModel(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.role_id'), nullable=False)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    profile_image = db.Column(db.String(255), nullable=True)
    status = db.Column(db.Enum('Active', 'Inactive'), default='Active')
    theme_preference = db.Column(db.Enum('light', 'dark', 'system'), default='light')
    created_at = db.Column(db.DateTime, default=_utc_now, nullable=False)
    updated_at = db.Column(db.DateTime, default=_utc_now, onupdate=_utc_now, nullable=False)

    sltb_profile = db.relationship('SLTBUserModel', backref='user', uselist=False, lazy=True)
    police_profile = db.relationship('PoliceOfficerModel', backref='user', uselist=False, lazy=True)
    sessions = db.relationship('UserSessionModel', backref='user', lazy=True)
    activity_logs = db.relationship('UserActivityLogModel', backref='user', lazy=True)

    def __init__(self, role_id=None, username=None, email=None, password=None, profile_image=None, status='Active', theme_preference='light', **kwargs):
        super().__init__(**kwargs)
        if role_id is not None:
            self.role_id = role_id
        if username is not None:
            self.username = username
        if email is not None:
            self.email = email
        if password is not None:
            self.password = password
        if profile_image is not None:
            self.profile_image = profile_image
        if status is not None:
            self.status = status
        if theme_preference is not None:
            self.theme_preference = theme_preference

    def to_safe_dict(self):
        pref = self.theme_preference or 'light'
        role_obj = getattr(self, 'role', None)
        role_name = role_obj.role_name if role_obj and hasattr(role_obj, 'role_name') else None

        # Build full name & department based on profile
        full_name = self.username
        department = 'System'
        phone = ''
        joined_date = self.created_at.strftime('%Y-%m-%d') if self.created_at else ''

        if self.police_profile:
            full_name = self.police_profile.full_name or full_name
            department = self.police_profile.police_station or department
            phone = self.police_profile.phone or phone
            if self.police_profile.joined_date:
                joined_date = str(self.police_profile.joined_date)
        elif self.sltb_profile:
            full_name = self.sltb_profile.full_name or full_name
            department = self.sltb_profile.department or department
            phone = self.sltb_profile.phone or phone
            if self.sltb_profile.joined_date:
                joined_date = str(self.sltb_profile.joined_date)

        data = {
            'id': self.user_id,
            'user_id': self.user_id,
            'userId': f"USR-{self.user_id:06d}",
            'role_id': self.role_id,
            'roleId': str(self.role_id),
            'role_name': role_name,
            'role': role_name,
            'roleType': 'POLICE_ADMIN' if role_name == 'Police Admin' else ('SLTB_ADMIN' if role_name == 'SLTB Admin' else 'TRAFFIC_POLICE_OFFICER'),
            'username': self.username,
            'email': self.email,
            'fullName': full_name,
            'full_name': full_name,
            'department': department,
            'phone': phone,
            'profile_image': self.profile_image,
            'avatar': self.profile_image,
            'status': self.status,
            'theme_preference': pref,
            'themePreference': pref,
            'joinedDate': joined_date,
            'joined_date': joined_date,
            'createdAt': self.created_at.strftime('%d %b %Y, %I:%M %p') if self.created_at else '',
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else '',
            'updatedAt': self.updated_at.strftime('%d %b %Y, %I:%M %p') if self.updated_at else '',
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S') if self.updated_at else '',
            'sltb_profile': self.sltb_profile.to_dict() if self.sltb_profile else None,
            'police_profile': self.police_profile.to_dict() if self.police_profile else None
        }

        # Add flat fields for frontend forms & view components
        if self.police_profile:
            p = self.police_profile
            data.update({
                'officerId': str(p.officer_id),
                'badgeNumber': p.badge_number,
                'rank': p.rank,
                'policeStation': p.police_station,
                'deviceToken': p.device_token or '••••••••A9F4',
                'isOnline': 'Online' if p.is_online else 'Offline',
                'lastActive': p.last_active.strftime('%d %b %Y, %I:%M %p') if p.last_active else '',
            })
        elif self.sltb_profile:
            s = self.sltb_profile
            data.update({
                'sltbUserId': f"SLTB-{s.sltb_user_id:06d}",
                'employeeId': s.employee_id,
                'designation': s.designation,
            })

        return data
