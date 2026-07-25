from app.data.repositories.base_repository import BaseRepository
from app.data.models.activity_log_model import UserActivityLogModel
from app.data.database import db
from datetime import datetime, timezone
from sqlalchemy.exc import SQLAlchemyError

class ActivityLogRepository(BaseRepository):

    def get_by_id(self, entity_id):
        return UserActivityLogModel.query.get(entity_id)

    def get_all(self):
        return UserActivityLogModel.query.all()

    def log_activity(self, user_id, activity_desc, commit=True):
        try:
            log = UserActivityLogModel(
                user_id=user_id,
                activity=activity_desc,
                activity_time=datetime.now(timezone.utc)
            )
            db.session.add(log)
            if commit:
                db.session.commit()
            return log
        except SQLAlchemyError:
            if commit:
                db.session.rollback()
            raise

    def get_recent_logs(self, limit=10):
        return UserActivityLogModel.query.order_by(UserActivityLogModel.activity_time.desc()).limit(limit).all()

    def create(self, data, commit=True, *args, **kwargs):
        return self.log_activity(data.get('user_id'), data.get('activity'), commit=commit)

    def update(self, activity_id, data, commit=True, *args, **kwargs):
        pass

    def delete(self, activity_id, commit=True, *args, **kwargs):
        pass
