from app.data.database import db
from datetime import datetime, timezone

class UserSessionModel(db.Model):
    __tablename__ = 'user_sessions'

    session_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    login_time = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    logout_time = db.Column(db.DateTime, nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    device_info = db.Column(db.String(255), nullable=True)

    def __init__(self, user_id=None, login_time=None, logout_time=None, ip_address=None, device_info=None, **kwargs):
        super().__init__(**kwargs)
        if user_id is not None:
            self.user_id = user_id
        if login_time is not None:
            self.login_time = login_time
        if logout_time is not None:
            self.logout_time = logout_time
        if ip_address is not None:
            self.ip_address = ip_address
        if device_info is not None:
            self.device_info = device_info

    def to_dict(self):
        return {
            'session_id': self.session_id,
            'user_id': self.user_id,
            'login_time': self.login_time.strftime('%Y-%m-%d %H:%M:%S') if self.login_time else None,
            'logout_time': self.logout_time.strftime('%Y-%m-%d %H:%M:%S') if self.logout_time else None,
            'ip_address': self.ip_address,
            'device_info': self.device_info
        }
