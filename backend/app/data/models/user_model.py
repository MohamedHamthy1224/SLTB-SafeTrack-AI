from app.data.database import db
from datetime import datetime

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
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    sltb_profile = db.relationship('SLTBUserModel', backref='user', uselist=False, lazy=True)
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
        return {
            'user_id': self.user_id,
            'role_id': self.role_id,
            'role_name': self.role.role_name if self.role else None,
            'username': self.username,
            'email': self.email,
            'profile_image': self.profile_image,
            'status': self.status,
            'theme_preference': pref,
            'themePreference': pref,
            'sltb_profile': self.sltb_profile.to_dict() if self.sltb_profile else None
        }
