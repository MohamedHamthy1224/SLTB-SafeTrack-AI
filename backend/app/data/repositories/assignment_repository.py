from app.data.database import db
from app.data.models.assignment_model import BusAssignmentModel
from app.data.repositories.base_repository import BaseRepository
from sqlalchemy.orm import joinedload
from datetime import date

class AssignmentRepository(BaseRepository):

    def get_by_id(self, entity_id):
        return db.session.query(BusAssignmentModel).filter(BusAssignmentModel.assignment_id == entity_id).first()

    def get_all(self):
        return db.session.query(BusAssignmentModel).all()

    def create(self, data, commit=True):
        assignment = BusAssignmentModel(
            bus_id=data.get('bus_id'),
            driver_id=data.get('driver_id'),
            route_id=data.get('route_id'),
            assigned_date=data.get('assigned_date', date.today()),
            status=data.get('status', 'Active')
        )
        db.session.add(assignment)
        if commit:
            db.session.commit()
        return assignment

    def update(self, entity_id, data, commit=True):
        assignment = self.get_by_id(entity_id)
        if not assignment:
            return None

        if 'bus_id' in data:
            assignment.bus_id = data['bus_id']
        if 'driver_id' in data:
            assignment.driver_id = data['driver_id']
        if 'route_id' in data:
            assignment.route_id = data['route_id']
        if 'assigned_date' in data:
            assignment.assigned_date = data['assigned_date']
        if 'status' in data:
            assignment.status = data['status']

        if commit:
            db.session.commit()
        return assignment

    def update_status(self, assignment_id, status, commit=True):
        assignment = self.get_by_id(assignment_id)
        if not assignment:
            return None
        assignment.status = status
        if commit:
            db.session.commit()
        return assignment

    def delete(self, entity_id, commit=True):
        assignment = self.get_by_id(entity_id)
        if assignment:
            db.session.delete(assignment)
            if commit:
                db.session.commit()
            return True
        return False

    def get_active_by_bus(self, bus_id):
        return db.session.query(BusAssignmentModel).filter(
            BusAssignmentModel.bus_id == bus_id,
            BusAssignmentModel.status == 'Active'
        ).order_by(BusAssignmentModel.created_at.desc()).first()

    def get_active_by_route_id(self, route_id):
        """
        Fetch active bus assignments for a given route using eager loading to eliminate N+1 queries.
        """
        return db.session.query(BusAssignmentModel).options(
            joinedload(BusAssignmentModel.bus)
        ).filter(
            BusAssignmentModel.route_id == route_id,
            BusAssignmentModel.status == 'Active'
        ).all()

    def is_driver_assigned_active(self, driver_id, exclude_bus_id=None):
        query = db.session.query(BusAssignmentModel).filter(
            BusAssignmentModel.driver_id == driver_id,
            BusAssignmentModel.status == 'Active'
        )
        if exclude_bus_id:
            query = query.filter(BusAssignmentModel.bus_id != exclude_bus_id)
        return query.first() is not None

    def get_active_by_driver_id(self, driver_id):
        """
        Return the single active BusAssignment for a given driver, or None
        if the driver currently has no active assignment.
        """
        return db.session.query(BusAssignmentModel).filter(
            BusAssignmentModel.driver_id == driver_id,
            BusAssignmentModel.status == 'Active'
        ).order_by(BusAssignmentModel.assigned_date.desc()).first()

    def is_bus_assigned_active(self, bus_id, exclude_driver_id=None):
        """
        Check whether a bus already has an active assignment.
        Pass exclude_driver_id to ignore the current driver's own assignment
        during an update operation so the bus isn't falsely flagged as taken.
        Returns True if the bus is actively assigned to another driver.
        """
        query = db.session.query(BusAssignmentModel).filter(
            BusAssignmentModel.bus_id == bus_id,
            BusAssignmentModel.status == 'Active'
        )
        if exclude_driver_id is not None:
            query = query.filter(BusAssignmentModel.driver_id != exclude_driver_id)
        return query.first() is not None

