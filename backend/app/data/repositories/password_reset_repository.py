from app.data.repositories.base_repository import BaseRepository
from app.data.models.password_reset_model import PasswordResetModel
from app.data.database import db
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

class PasswordResetRepository(BaseRepository):

    def get_by_id(self, entity_id):
        return PasswordResetModel.query.get(entity_id)

    def get_all(self):
        return PasswordResetModel.query.all()

    def get_by_token(self, token):
        return PasswordResetModel.query.filter_by(token=token).first()

    def create_token(self, user_id, token, expires_at):
        try:
            # Mark existing unused tokens for this user as used
            PasswordResetModel.query.filter_by(user_id=user_id, used=False).update({'used': True})
            
            reset_record = PasswordResetModel(
                user_id=user_id,
                token=token,
                expires_at=expires_at,
                used=False
            )
            db.session.add(reset_record)
            db.session.commit()
            return reset_record
        except SQLAlchemyError:
            db.session.rollback()
            raise

    def mark_as_used(self, reset_record):
        try:
            reset_record.used = True
            db.session.commit()
            return reset_record
        except SQLAlchemyError:
            db.session.rollback()
            raise

    def create(self, data):
        return self.create_token(data.get('user_id'), data.get('token'), data.get('expires_at'))

    def update(self, entity_id, data):
        record = self.get_by_id(entity_id)
        if record:
            for k, v in data.items():
                setattr(record, k, v)
            db.session.commit()
        return record

    def delete(self, entity_id):
        record = self.get_by_id(entity_id)
        if record:
            db.session.delete(record)
            db.session.commit()
            return True
        return False
