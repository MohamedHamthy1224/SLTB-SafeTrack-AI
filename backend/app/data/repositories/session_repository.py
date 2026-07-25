from app.data.repositories.base_repository import BaseRepository
from app.data.models.session_model import UserSessionModel
from app.data.database import db
from datetime import datetime, timezone
from sqlalchemy.exc import SQLAlchemyError

class SessionRepository(BaseRepository):

    def get_by_id(self, entity_id):
        return UserSessionModel.query.get(entity_id)

    def get_all(self):
        return UserSessionModel.query.all()

    def create_session(self, user_id, ip_address=None, device_info=None):
        try:
            session = UserSessionModel(
                user_id=user_id,
                login_time=datetime.now(timezone.utc),
                ip_address=ip_address,
                device_info=device_info
            )
            db.session.add(session)
            db.session.commit()
            return session
        except SQLAlchemyError:
            db.session.rollback()
            raise

    def close_session(self, session_id):
        try:
            session = self.get_by_id(session_id)
            if session:
                session.logout_time = datetime.now(timezone.utc)
                db.session.commit()
            return session
        except SQLAlchemyError:
            db.session.rollback()
            raise

    def revoke_all_for_user(self, user_id, commit=True):
        try:
            active_sessions = UserSessionModel.query.filter_by(user_id=user_id, logout_time=None).all()
            now = datetime.now(timezone.utc)
            for s in active_sessions:
                s.logout_time = now
            if commit:
                db.session.commit()
            return True
        except SQLAlchemyError:
            if commit:
                db.session.rollback()
            raise

    def create(self, data):
        return self.create_session(data.get('user_id'), data.get('ip_address'), data.get('device_info'))

    def update(self, session_id, data):
        return self.close_session(session_id)

    def delete(self, session_id):
        session = self.get_by_id(session_id)
        if session:
            db.session.delete(session)
            db.session.commit()
            return True
        return False
