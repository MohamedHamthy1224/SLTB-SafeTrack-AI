from app.data.database import db
from datetime import datetime

class UserActivityLogModel(db.Model):
    __tablename__ = 'user_activity_logs'

    activity_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    activity = db.Column(db.String(255), nullable=False)
    activity_time = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, user_id=None, activity=None, activity_time=None, **kwargs):
        super().__init__(**kwargs)
        if user_id is not None:
            self.user_id = user_id
        if activity is not None:
            self.activity = activity
        if activity_time is not None:
            self.activity_time = activity_time

    def to_dict(self):
        return {
            'activity_id': self.activity_id,
            'user_id': self.user_id,
            'activity': self.activity,
            'activity_time': self.activity_time.strftime('%Y-%m-%d %H:%M:%S') if self.activity_time else None
        }
