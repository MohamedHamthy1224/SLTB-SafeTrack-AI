from app.data.repositories.base_repository import BaseRepository
from app.data.models.user_model import UserModel
from app.data.models.role_model import RoleModel
from app.data.models.sltb_user_model import SLTBUserModel
from app.data.database import db
from sqlalchemy.exc import SQLAlchemyError

class UserRepository(BaseRepository):

    def get_by_id(self, user_id):
        return UserModel.query.get(user_id)

    def get_all(self):
        return UserModel.query.all()

    def get_by_identifier(self, identifier):
        """Locates user by username or email"""
        return UserModel.query.filter(
            (UserModel.username == identifier) | (UserModel.email == identifier)
        ).first()

    def get_by_email(self, email):
        return UserModel.query.filter_by(email=email).first()

    def create(self, data):
        try:
            user = UserModel(**data)
            db.session.add(user)
            db.session.commit()
            return user
        except SQLAlchemyError:
            db.session.rollback()
            raise

    def update(self, user_id, data):
        try:
            user = self.get_by_id(user_id)
            if user:
                for key, value in data.items():
                    if hasattr(user, key):
                        setattr(user, key, value)
                db.session.commit()
            return user
        except SQLAlchemyError:
            db.session.rollback()
            raise

    def delete(self, user_id):
        try:
            user = self.get_by_id(user_id)
            if user:
                db.session.delete(user)
                db.session.commit()
                return True
            return False
        except SQLAlchemyError:
            db.session.rollback()
            raise
