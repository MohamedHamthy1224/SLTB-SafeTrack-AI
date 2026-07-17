from app.data.database import db
from datetime import datetime

class PasswordResetModel(db.Model):
    __tablename__ = 'password_resets'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    token = db.Column(db.String(255), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship('UserModel', backref=db.backref('password_resets', cascade='all, delete-orphan'), lazy=True)

    def __init__(self, user_id=None, token=None, expires_at=None, used=False, **kwargs):
        super().__init__(**kwargs)
        if user_id is not None:
            self.user_id = user_id
        if token is not None:
            self.token = token
        if expires_at is not None:
            self.expires_at = expires_at
        if used is not None:
            self.used = used

    def is_valid(self):
        return not self.used and datetime.utcnow() < self.expires_at

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'token': self.token,
            'expires_at': self.expires_at.strftime('%Y-%m-%d %H:%M:%S') if self.expires_at else None,
            'used': bool(self.used),
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
