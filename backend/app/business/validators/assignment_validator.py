from app.business.validators.base_validator import BaseValidator

class AssignmentValidator(BaseValidator):

    def __init__(self, route_repository=None, driver_repository=None, assignment_repository=None):
        self.route_repository = route_repository
        self.driver_repository = driver_repository
        self.assignment_repository = assignment_repository

    def validate(self, data, exclude_bus_id=None):
        errors = {}

        route_id = data.get('route_id')
        if not route_id:
            errors['route_id'] = "Please select a route."
        else:
            try:
                r_id = int(route_id)
                if self.route_repository:
                    route = self.route_repository.get_by_id(r_id)
                    if not route:
                        errors['route_id'] = "The selected route does not exist."
                    elif route.status != 'Active':
                        errors['route_id'] = "The selected route is inactive and cannot be assigned."
            except (ValueError, TypeError):
                errors['route_id'] = "Route ID must be a valid integer."

        driver_id = data.get('driver_id')
        if not driver_id:
            errors['driver_id'] = "Please select a driver."
        else:
            try:
                d_id = int(driver_id)
                if self.driver_repository:
                    driver = self.driver_repository.get_by_id(d_id)
                    if not driver:
                        errors['driver_id'] = "The selected driver does not exist."
                    elif driver.status != 'Active':
                        errors['driver_id'] = "The selected driver is inactive and cannot be assigned."
                    elif self.assignment_repository and self.assignment_repository.is_driver_assigned_active(d_id, exclude_bus_id):
                        errors['driver_id'] = "The selected driver is already assigned to another active bus."
            except (ValueError, TypeError):
                errors['driver_id'] = "Driver ID must be a valid integer."

        return errors
