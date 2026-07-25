from app.data.database import db
from app.data.models.bus_model import BusModel
from app.data.models.assignment_model import BusAssignmentModel
from app.data.models.route_model import RouteModel
from app.data.repositories.base_repository import BaseRepository
from sqlalchemy import func, distinct

class BusRepository(BaseRepository):

    def get_by_id(self, entity_id):
        return db.session.query(BusModel).filter(BusModel.bus_id == entity_id).first()

    def get_all(self):
        return db.session.query(BusModel).all()

    def get_all_models(self):
        """Return all BusModel ORM instances for direct attribute access by the service layer."""
        return db.session.query(BusModel).all()

    def create(self, data, commit=True):
        bus = BusModel(
            bus_number=data.get('bus_number'),
            registration_number=data.get('registration_number'),
            service_type=data.get('service_type', 'Public Service'),
            depot=data.get('depot'),
            model=data.get('model'),
            chassis_number=data.get('chassis_number'),
            engine_number=data.get('engine_number'),
            capacity=data.get('capacity', 0),
            standing_capacity=data.get('standing_capacity', 0),
            fuel_type=data.get('fuel_type', 'Diesel'),
            manufacture_year=data.get('manufacture_year'),
            status=data.get('status', 'Active'),
            registration_date=data.get('registration_date')
        )
        db.session.add(bus)
        if commit:
            db.session.commit()
        return bus

    def update(self, entity_id, data, commit=True):
        bus = self.get_by_id(entity_id)
        if not bus:
            return None

        if 'bus_number' in data:
            bus.bus_number = data['bus_number']
        if 'registration_number' in data:
            bus.registration_number = data['registration_number']
        if 'service_type' in data:
            bus.service_type = data['service_type']
        if 'depot' in data:
            bus.depot = data['depot']
        if 'model' in data:
            bus.model = data['model']
        if 'chassis_number' in data:
            bus.chassis_number = data['chassis_number']
        if 'engine_number' in data:
            bus.engine_number = data['engine_number']
        if 'capacity' in data:
            bus.capacity = data['capacity']
        if 'standing_capacity' in data:
            bus.standing_capacity = data['standing_capacity']
        if 'fuel_type' in data:
            bus.fuel_type = data['fuel_type']
        if 'manufacture_year' in data:
            bus.manufacture_year = data['manufacture_year']
        if 'status' in data:
            bus.status = data['status']
        if 'registration_date' in data:
            bus.registration_date = data['registration_date']

        if commit:
            db.session.commit()
        return bus

    def delete(self, entity_id, commit=True):
        bus = self.get_by_id(entity_id)
        if bus:
            db.session.delete(bus)
            if commit:
                db.session.commit()
            return True
        return False

    def get_summary(self):
        total_buses = db.session.query(func.count(BusModel.bus_id)).scalar() or 0
        active_buses = db.session.query(func.count(BusModel.bus_id)).filter(BusModel.status == 'Active').scalar() or 0
        maintenance_buses = db.session.query(func.count(BusModel.bus_id)).filter(BusModel.status == 'Maintenance').scalar() or 0
        inactive_buses = db.session.query(func.count(BusModel.bus_id)).filter(BusModel.status == 'Inactive').scalar() or 0

        routes_covered = db.session.query(func.count(distinct(BusAssignmentModel.route_id))).filter(
            BusAssignmentModel.status == 'Active'
        ).scalar() or 0

        active_percentage = round((active_buses / total_buses * 100), 1) if total_buses > 0 else 0
        maintenance_percentage = round((maintenance_buses / total_buses * 100), 1) if total_buses > 0 else 0
        inactive_percentage = round((inactive_buses / total_buses * 100), 1) if total_buses > 0 else 0

        return {
            'totalBuses': total_buses,
            'activeBuses': active_buses,
            'activePercentage': active_percentage,
            'maintenanceBuses': maintenance_buses,
            'maintenancePercentage': maintenance_percentage,
            'inactiveBuses': inactive_buses,
            'inactivePercentage': inactive_percentage,
            'routesCovered': routes_covered
        }

    def exists_by_bus_number(self, bus_number, exclude_bus_id=None):
        query = db.session.query(BusModel).filter(BusModel.bus_number == bus_number)
        if exclude_bus_id:
            query = query.filter(BusModel.bus_id != exclude_bus_id)
        return query.first() is not None

    def exists_by_registration_number(self, registration_number, exclude_bus_id=None):
        query = db.session.query(BusModel).filter(BusModel.registration_number == registration_number)
        if exclude_bus_id:
            query = query.filter(BusModel.bus_id != exclude_bus_id)
        return query.first() is not None

    def exists_by_chassis_number(self, chassis_number, exclude_bus_id=None):
        if not chassis_number:
            return False
        query = db.session.query(BusModel).filter(BusModel.chassis_number == chassis_number)
        if exclude_bus_id:
            query = query.filter(BusModel.bus_id != exclude_bus_id)
        return query.first() is not None

    def exists_by_engine_number(self, engine_number, exclude_bus_id=None):
        if not engine_number:
            return False
        query = db.session.query(BusModel).filter(BusModel.engine_number == engine_number)
        if exclude_bus_id:
            query = query.filter(BusModel.bus_id != exclude_bus_id)
        return query.first() is not None
