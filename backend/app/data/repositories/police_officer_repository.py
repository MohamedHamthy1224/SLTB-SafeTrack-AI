from app.data.repositories.base_repository import BaseRepository
from app.data.models.police_officer_model import PoliceOfficerModel
from app.data.database import db
from datetime import datetime, date

class PoliceOfficerRepository(BaseRepository):

    def get_by_id(self, entity_id):
        return db.session.query(PoliceOfficerModel).filter(PoliceOfficerModel.officer_id == entity_id).first()

    def get_by_user_id(self, user_id):
        return db.session.query(PoliceOfficerModel).filter(PoliceOfficerModel.user_id == user_id).first()

    def get_by_badge_number(self, badge_number, exclude_user_id=None):
        if not badge_number:
            return None
        query = db.session.query(PoliceOfficerModel).filter(PoliceOfficerModel.badge_number == badge_number)
        if exclude_user_id:
            query = query.filter(PoliceOfficerModel.user_id != exclude_user_id)
        return query.first()

    def get_all(self):
        return db.session.query(PoliceOfficerModel).all()

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

        is_online_val = False
        if 'is_online' in data:
            if isinstance(data['is_online'], bool):
                is_online_val = data['is_online']
            elif str(data['is_online']).lower() in ['true', '1', 'online']:
                is_online_val = True

        profile = PoliceOfficerModel(
            user_id=data.get('user_id'),
            full_name=data.get('full_name'),
            badge_number=data.get('badge_number'),
            rank=data.get('rank'),
            police_station=data.get('police_station'),
            phone=data.get('phone'),
            joined_date=_parse_date(data.get('joined_date')),
            device_token=data.get('device_token'),
            is_online=is_online_val
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
        if 'badge_number' in data and data['badge_number'] is not None:
            profile.badge_number = str(data['badge_number']).strip()
        if 'rank' in data:
            profile.rank = str(data['rank']).strip() if data['rank'] is not None else None
        if 'police_station' in data:
            profile.police_station = str(data['police_station']).strip() if data['police_station'] is not None else None
        if 'phone' in data:
            profile.phone = str(data['phone']).strip() if data['phone'] is not None else None
        if 'joined_date' in data:
            profile.joined_date = _parse_date(data['joined_date'])
        if 'device_token' in data:
            profile.device_token = str(data['device_token']).strip() if data['device_token'] is not None else None
        if 'is_online' in data:
            if isinstance(data['is_online'], bool):
                profile.is_online = data['is_online']
            elif str(data['is_online']).lower() in ['true', '1', 'online']:
                profile.is_online = True
            else:
                profile.is_online = False

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
