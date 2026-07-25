from app.data.repositories.base_repository import BaseRepository
from app.data.models.sltb_user_model import SLTBUserModel
from app.data.database import db
from datetime import datetime, date
from sqlalchemy.exc import SQLAlchemyError

class SLTBUserRepository(BaseRepository):

    def get_by_id(self, entity_id):
        return db.session.query(SLTBUserModel).filter(SLTBUserModel.sltb_user_id == entity_id).first()

    def get_by_user_id(self, user_id):
        return db.session.query(SLTBUserModel).filter(SLTBUserModel.user_id == user_id).first()

    def get_by_employee_id(self, employee_id, exclude_user_id=None):
        if not employee_id:
            return None
        query = db.session.query(SLTBUserModel).filter(SLTBUserModel.employee_id == employee_id)
        if exclude_user_id:
            query = query.filter(SLTBUserModel.user_id != exclude_user_id)
        return query.first()

    def get_all(self):
        return db.session.query(SLTBUserModel).all()

    def create(self, data, commit=True, *args, **kwargs):
        def _parse_date(val):
            if not val:
                return None
            if isinstance(val, date):
                return val
            try:
                return datetime.strptime(str(val), "%Y-%m-%d").date()
            except ValueError:
                return None

        profile = SLTBUserModel(
            user_id=data.get('user_id'),
            full_name=data.get('full_name'),
            employee_id=data.get('employee_id'),
            department=data.get('department'),
            designation=data.get('designation'),
            phone=data.get('phone'),
            joined_date=_parse_date(data.get('joined_date'))
        )
        db.session.add(profile)
        if commit:
            db.session.commit()
        return profile

    def update_profile(self, user_id, data, commit=True):
        profile = self.get_by_user_id(user_id)
        if not profile:
            return None

        def _parse_date(val):
            if val is None:
                return profile.joined_date
            if isinstance(val, date):
                return val
            try:
                return datetime.strptime(str(val), "%Y-%m-%d").date()
            except ValueError:
                return profile.joined_date

        if 'full_name' in data and data['full_name'] is not None:
            profile.full_name = str(data['full_name']).strip()
        if 'employee_id' in data and data['employee_id'] is not None:
            profile.employee_id = str(data['employee_id']).strip()
        if 'department' in data:
            profile.department = str(data['department']).strip() if data['department'] is not None else None
        if 'designation' in data:
            profile.designation = str(data['designation']).strip() if data['designation'] is not None else None
        if 'phone' in data:
            profile.phone = str(data['phone']).strip() if data['phone'] is not None else None
        if 'joined_date' in data:
            profile.joined_date = _parse_date(data['joined_date'])

        if commit:
            db.session.commit()
        return profile

    def update(self, entity_id, data, commit=True, *args, **kwargs):
        return self.update_profile(entity_id, data, commit=commit)

    def delete(self, entity_id, commit=True, *args, **kwargs):
        profile = self.get_by_id(entity_id)
        if profile:
            db.session.delete(profile)
            if commit:
                db.session.commit()
            return True
        return False
