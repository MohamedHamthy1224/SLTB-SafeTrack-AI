from app.data.repositories.base_repository import BaseRepository
from app.data.models.user_model import UserModel
from app.data.models.role_model import RoleModel
from app.data.models.sltb_user_model import SLTBUserModel
from app.data.database import db
from sqlalchemy.exc import SQLAlchemyError

class UserRepository(BaseRepository):

    def get_by_id(self, entity_id):
        return UserModel.query.get(entity_id)

    def get_all(self):
        return UserModel.query.all()

    def get_by_identifier(self, identifier):
        """Locates user by username or email"""
        return UserModel.query.filter(
            (UserModel.username == identifier) | (UserModel.email == identifier)
        ).first()

    def get_by_email(self, email, exclude_user_id=None):
        if not email:
            return None
        query = UserModel.query.filter(UserModel.email == str(email).strip().lower())
        if exclude_user_id:
            query = query.filter(UserModel.user_id != exclude_user_id)
        return query.first()

    def get_theme_preference(self, user_id):
        user = self.get_by_id(user_id)
        if not user:
            return 'light'
        return user.theme_preference or 'light'

    def update_theme_preference(self, user_id, theme_preference, commit=True):
        user = self.get_by_id(user_id)
        if not user:
            return None
        user.theme_preference = theme_preference
        if commit:
            db.session.commit()
        return user

    def update_profile(self, user_id, email=None, profile_image=None, commit=True):
        user = self.get_by_id(user_id)
        if not user:
            return None
        if email is not None:
            user.email = str(email).strip().lower()
        if profile_image is not None:
            user.profile_image = profile_image
        if commit:
            db.session.commit()
        return user

    def update_password(self, user_id, password_hash, commit=True):
        user = self.get_by_id(user_id)
        if not user:
            return False
        user.password = password_hash
        if commit:
            db.session.commit()
        return True

    def create(self, data, commit=True, *args, **kwargs):
        try:
            user = UserModel(**data)
            db.session.add(user)
            if commit:
                db.session.commit()
            return user
        except SQLAlchemyError:
            if commit:
                db.session.rollback()
            raise

    def update(self, user_id, data, commit=True, *args, **kwargs):
        try:
            user = self.get_by_id(user_id)
            if user:
                for key, value in data.items():
                    if hasattr(user, key):
                        setattr(user, key, value)
                if commit:
                    db.session.commit()
            return user
        except SQLAlchemyError:
            if commit:
                db.session.rollback()
            raise

    def delete(self, user_id, *args, **kwargs):
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
