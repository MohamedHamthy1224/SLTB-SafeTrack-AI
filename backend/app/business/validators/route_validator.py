from app.business.validators.base_validator import BaseValidator
from app.data.repositories.route_repository import RouteRepository
from typing import Dict, Any, Optional

class RouteValidator(BaseValidator):
    """
    RouteValidator enforcing creation and edit field constraints.
    Inherits from BaseValidator and overrides validate().
    """

    def __init__(self, route_repository=None):
        self.route_repo = route_repository or RouteRepository()

    def validate(self, data: Dict[str, Any], is_update: bool = False, current_route_id: Optional[int] = None) -> Dict[str, str]:
        errors = {}

        if not data:
            return {'general': 'Request payload cannot be empty.'}

        # 1. Route Number Validation
        route_number = str(data.get('route_number', '')).strip()
        if not route_number:
            errors['route_number'] = 'Route number is required.'
        elif len(route_number) > 20:
            errors['route_number'] = 'Route number cannot exceed 20 characters.'
        else:
            existing = self.route_repo.get_by_route_number(route_number)
            if existing:
                if not is_update or (is_update and existing.route_id != current_route_id):
                    errors['route_number'] = 'This route number already exists.'

        # 2. Route Name Validation
        route_name = str(data.get('route_name', '')).strip()
        if not route_name:
            errors['route_name'] = 'Route name is required.'
        elif len(route_name) > 150:
            errors['route_name'] = 'Route name cannot exceed 150 characters.'

        # 3. Start Location Validation
        start_location = str(data.get('start_location', '')).strip()
        if not start_location:
            errors['start_location'] = 'Start location is required.'
        elif len(start_location) > 100:
            errors['start_location'] = 'Start location cannot exceed 100 characters.'

        # 4. End Location Validation
        end_location = str(data.get('end_location', '')).strip()
        if not end_location:
            errors['end_location'] = 'End location is required.'
        elif len(end_location) > 100:
            errors['end_location'] = 'End location cannot exceed 100 characters.'

        # 5. Start and End Location Identical Check
        if start_location and end_location and start_location.lower() == end_location.lower():
            errors['end_location'] = 'Start location and end location cannot be identical.'

        # 6. Distance Validation
        distance = data.get('distance_km')
        if distance is None or str(distance).strip() == '':
            errors['distance_km'] = 'Distance is required.'
        else:
            try:
                dist_val = float(distance)
                if dist_val <= 0:
                    errors['distance_km'] = 'Distance must be greater than zero.'
                elif dist_val > 9999.99:
                    errors['distance_km'] = 'Distance value is too large.'
            except (ValueError, TypeError):
                errors['distance_km'] = 'Distance must be a valid numeric value.'

        # 7. Estimated Duration Validation
        duration = data.get('estimated_duration')
        if duration is None or str(duration).strip() == '':
            errors['estimated_duration'] = 'Estimated duration is required.'
        else:
            try:
                dur_val = int(duration)
                if dur_val <= 0:
                    errors['estimated_duration'] = 'Estimated duration must be greater than zero.'
            except (ValueError, TypeError):
                errors['estimated_duration'] = 'Estimated duration must be a valid integer.'

        # 8. Status Validation
        status = str(data.get('status', 'Active')).strip()
        if not status:
            errors['status'] = 'Status is required.'
        elif status not in ('Active', 'Inactive'):
            errors['status'] = 'Status must be Active or Inactive.'

        return errors
