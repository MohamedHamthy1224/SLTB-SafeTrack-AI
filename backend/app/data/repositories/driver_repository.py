from app.data.database import db
from app.data.models.driver_model import DriverModel
from app.data.repositories.base_repository import BaseRepository
from app.domain.entities.driver import Driver
from datetime import datetime, date

class DriverRepository(BaseRepository):

    def _model_to_entity(self, model):
        if not model:
            return None
        return Driver(
            driver_id=model.driver_id,
            full_name=model.full_name,
            date_of_birth=model.date_of_birth,
            gender=model.gender,
            address=model.address,
            profile_picture=model.profile_picture,
            license_number=model.license_number,
            issue_date=model.issue_date,
            expiry_date=model.expiry_date,
            nic=model.nic,
            phone=model.phone,
            alternative_phone_number=model.alternative_phone_number,
            email_address=model.email_address,
            experience_years=model.experience_years,
            join_date=model.join_date,
            status=model.status,
            created_at=model.created_at
        )

    def get_by_id(self, entity_id):
        model = db.session.query(DriverModel).filter(DriverModel.driver_id == entity_id).first()
        return model

    def get_entity_by_id(self, entity_id):
        model = self.get_by_id(entity_id)
        return self._model_to_entity(model)

    def get_all(self):
        models = db.session.query(DriverModel).all()
        return [self._model_to_entity(m) for m in models]

    def get_all_models(self):
        return db.session.query(DriverModel).all()

    def create(self, data, commit=True):
        def _parse_date(val):
            if not val:
                return None
            if isinstance(val, date):
                return val
            try:
                return datetime.strptime(str(val), "%Y-%m-%d").date()
            except ValueError:
                return None

        driver = DriverModel(
            full_name=data.get('full_name'),
            date_of_birth=_parse_date(data.get('date_of_birth')),
            gender=data.get('gender'),
            address=data.get('address'),
            profile_picture=data.get('profile_picture'),
            license_number=data.get('license_number'),
            issue_date=_parse_date(data.get('issue_date')),
            expiry_date=_parse_date(data.get('expiry_date')),
            nic=data.get('nic'),
            phone=data.get('phone'),
            alternative_phone_number=data.get('alternative_phone_number'),
            email_address=data.get('email_address'),
            experience_years=int(data.get('experience_years', 0)) if data.get('experience_years') is not None else 0,
            join_date=_parse_date(data.get('join_date')),
            status=data.get('status', 'Active')
        )
        db.session.add(driver)
        if commit:
            db.session.commit()
        return driver

    def update(self, driver_or_id, data=None, commit=True):
        if isinstance(driver_or_id, DriverModel):
            driver = driver_or_id
        else:
            driver = self.get_by_id(driver_or_id)

        if not driver or not data:
            return driver

        def _parse_date(val):
            if val is None:
                return None
            if isinstance(val, date):
                return val
            try:
                return datetime.strptime(str(val), "%Y-%m-%d").date()
            except ValueError:
                return None

        field_map = {
            'full_name': 'full_name',
            'date_of_birth': ('date_of_birth', _parse_date),
            'gender': 'gender',
            'address': 'address',
            'profile_picture': 'profile_picture',
            'license_number': 'license_number',
            'issue_date': ('issue_date', _parse_date),
            'expiry_date': ('expiry_date', _parse_date),
            'nic': 'nic',
            'phone': 'phone',
            'alternative_phone_number': 'alternative_phone_number',
            'email_address': 'email_address',
            'experience_years': ('experience_years', lambda x: int(x) if x is not None else 0),
            'join_date': ('join_date', _parse_date),
            'status': 'status'
        }

        for key, target in field_map.items():
            if key in data:
                val = data[key]
                if isinstance(target, tuple):
                    attr_name, transform = target
                    setattr(driver, attr_name, transform(val))
                else:
                    setattr(driver, target, val)

        if commit:
            db.session.commit()
        return driver

    def update_status(self, driver_id, status, commit=True):
        driver = self.get_by_id(driver_id)
        if driver:
            driver.status = status
            if commit:
                db.session.commit()
            return driver
        return None

    def delete(self, entity_id, commit=True):
        driver = self.get_by_id(entity_id)
        if driver:
            db.session.delete(driver)
            if commit:
                db.session.commit()
            return True
        return False

    def get_active_drivers(self):
        return db.session.query(DriverModel).filter(DriverModel.status == 'Active').all()

    def get_summary(self):
        total_drivers = db.session.query(DriverModel).count()
        active_drivers = db.session.query(DriverModel).filter(DriverModel.status == 'Active').count()
        inactive_drivers = db.session.query(DriverModel).filter(DriverModel.status == 'Inactive').count()

        active_percentage = round((active_drivers / total_drivers * 100), 2) if total_drivers > 0 else 0.0
        inactive_percentage = round((inactive_drivers / total_drivers * 100), 2) if total_drivers > 0 else 0.0

        return {
            'totalDrivers': total_drivers,
            'activeDrivers': active_drivers,
            'inactiveDrivers': inactive_drivers,
            'activePercentage': active_percentage,
            'inactivePercentage': inactive_percentage
        }

    def get_by_license(self, license_number, exclude_driver_id=None):
        query = db.session.query(DriverModel).filter(DriverModel.license_number == license_number)
        if exclude_driver_id:
            query = query.filter(DriverModel.driver_id != exclude_driver_id)
        return query.first()

    def get_by_nic(self, nic, exclude_driver_id=None):
        if not nic:
            return None
        query = db.session.query(DriverModel).filter(DriverModel.nic == nic)
        if exclude_driver_id:
            query = query.filter(DriverModel.driver_id != exclude_driver_id)
        return query.first()

    def get_by_email(self, email_address, exclude_driver_id=None):
        if not email_address:
            return None
        query = db.session.query(DriverModel).filter(DriverModel.email_address == email_address)
        if exclude_driver_id:
            query = query.filter(DriverModel.driver_id != exclude_driver_id)
        return query.first()

