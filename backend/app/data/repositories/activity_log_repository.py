from app.data.repositories.base_repository import BaseRepository
from app.data.models.activity_log_model import UserActivityLogModel
from app.data.database import db
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

class ActivityLogRepository(BaseRepository):

    def get_by_id(self, activity_id):
        return UserActivityLogModel.query.get(activity_id)

    def get_all(self):
        return UserActivityLogModel.query.all()

    def log_activity(self, user_id, activity_desc):
        try:
            log = UserActivityLogModel(
                user_id=user_id,
                activity=activity_desc,
                activity_time=datetime.utcnow()
            )
            db.session.add(log)
            db.session.commit()
            return log
        except SQLAlchemyError:
            db.session.rollback()
            raise

    def get_recent_logs(self, limit=10):
        return UserActivityLogModel.query.order_by(UserActivityLogModel.activity_time.desc()).limit(limit).all()

    def create(self, data):
        return self.log_activity(data.get('user_id'), data.get('activity'))

    def update(self, activity_id, data):
        pass

    def delete(self, activity_id):
        pass
