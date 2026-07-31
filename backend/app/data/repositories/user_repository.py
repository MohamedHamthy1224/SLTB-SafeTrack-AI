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

    def get_by_username(self, username, exclude_user_id=None):
        if not username:
            return None
        query = UserModel.query.filter(UserModel.username == str(username).strip())
        if exclude_user_id:
            query = query.filter(UserModel.user_id != exclude_user_id)
        return query.first()

    def get_by_email(self, email, exclude_user_id=None):
        if not email:
            return None
        query = UserModel.query.filter(UserModel.email == str(email).strip().lower())
        if exclude_user_id:
            query = query.filter(UserModel.user_id != exclude_user_id)
        return query.first()

    def get_filtered_users(self, search='', role=None, status=None, page=1, per_page=50, sort_by='user_id', order='asc'):
        from app.data.models.police_officer_model import PoliceOfficerModel
        query = db.session.query(UserModel).outerjoin(RoleModel).outerjoin(SLTBUserModel).outerjoin(PoliceOfficerModel)

        if search:
            q = f"%{search.strip().lower()}%"
            query = query.filter(
                (UserModel.username.ilike(q)) |
                (UserModel.email.ilike(q)) |
                (SLTBUserModel.full_name.ilike(q)) |
                (SLTBUserModel.department.ilike(q)) |
                (SLTBUserModel.phone.ilike(q)) |
                (SLTBUserModel.employee_id.ilike(q)) |
                (PoliceOfficerModel.full_name.ilike(q)) |
                (PoliceOfficerModel.badge_number.ilike(q)) |
                (PoliceOfficerModel.police_station.ilike(q)) |
                (PoliceOfficerModel.phone.ilike(q))
            )

        if role and role != 'All Roles':
            query = query.filter(RoleModel.role_name == role)

        if status and status != 'All Status':
            query = query.filter(UserModel.status == status)

        # Count total before pagination
        total_items = query.count()

        # Sorting
        order_func = db.desc if str(order).lower() == 'desc' else db.asc
        if sort_by == 'username':
            query = query.order_by(order_func(UserModel.username))
        elif sort_by == 'email':
            query = query.order_by(order_func(UserModel.email))
        elif sort_by == 'status':
            query = query.order_by(order_func(UserModel.status))
        elif sort_by == 'created_at':
            query = query.order_by(order_func(UserModel.created_at))
        else:
            query = query.order_by(order_func(UserModel.user_id))

        # Pagination
        if page and per_page:
            try:
                p = max(1, int(page))
                pp = max(1, min(100, int(per_page)))
                query = query.offset((p - 1) * pp).limit(pp)
            except (ValueError, TypeError):
                pass

        users = query.all()
        return users, total_items

    def get_summary_stats(self):
        police_admin_count = db.session.query(UserModel).join(RoleModel).filter(RoleModel.role_name == 'Police Admin').count()
        traffic_police_count = db.session.query(UserModel).join(RoleModel).filter(RoleModel.role_name == 'Traffic Police Officer').count()
        sltb_admin_count = db.session.query(UserModel).join(RoleModel).filter(RoleModel.role_name == 'SLTB Admin').count()
        total_users_count = db.session.query(UserModel).count()

        return {
            'policeAdminUsers': police_admin_count,
            'trafficPoliceOfficers': traffic_police_count,
            'sltbAdminUsers': sltb_admin_count,
            'totalUsers': total_users_count
        }

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
