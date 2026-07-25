from app.data.repositories.assignment_repository import AssignmentRepository

class AssignmentService:

    def __init__(self, assignment_repo=None):
        self.assignment_repo = assignment_repo or AssignmentRepository()

    def get_assignment_by_id(self, assignment_id):
        return self.assignment_repo.get_by_id(assignment_id)

    def get_active_assignment_for_bus(self, bus_id):
        return self.assignment_repo.get_active_by_bus(bus_id)

    def assign_driver_and_route(self, bus_id, driver_id, route_id, assigned_date=None, commit=True):
        return self.assignment_repo.create({
            'bus_id': bus_id,
            'driver_id': driver_id,
            'route_id': route_id,
            'assigned_date': assigned_date,
            'status': 'Active'
        }, commit=commit)
