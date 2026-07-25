from app.business.validators.base_validator import BaseValidator
from app.domain.entities.bus import Bus
from datetime import datetime

class BusValidator(BaseValidator):

    def __init__(self, bus_repository=None):
        self.bus_repository = bus_repository

    def validate(self, data, exclude_bus_id=None):
        errors = {}

        bus_number = str(data.get('bus_number', '') or '').strip()
        if not bus_number:
            errors['bus_number'] = "Bus number is required."
        elif len(bus_number) > 30:
            errors['bus_number'] = "Bus number cannot exceed 30 characters."
        elif self.bus_repository and self.bus_repository.exists_by_bus_number(bus_number, exclude_bus_id):
            errors['bus_number'] = "This bus number already exists."

        registration_number = str(data.get('registration_number', '') or '').strip()
        if not registration_number:
            errors['registration_number'] = "Registration number is required."
        elif len(registration_number) > 20:
            errors['registration_number'] = "Registration number cannot exceed 20 characters."
        elif self.bus_repository and self.bus_repository.exists_by_registration_number(registration_number, exclude_bus_id):
            errors['registration_number'] = "This registration number already exists."

        service_type = data.get('service_type')
        if not service_type:
            errors['service_type'] = "Service type is required."
        elif service_type not in Bus.ALLOWED_SERVICE_TYPES:
            errors['service_type'] = f"Invalid service type. Allowed values: {', '.join(Bus.ALLOWED_SERVICE_TYPES)}"

        model = str(data.get('model', '') or '').strip()
        if not model:
            errors['model'] = "Bus model is required."
        elif len(model) > 100:
            errors['model'] = "Bus model cannot exceed 100 characters."

        chassis_number = str(data.get('chassis_number', '') or '').strip()
        if not chassis_number:
            errors['chassis_number'] = "Chassis number is required."
        elif len(chassis_number) > 50:
            errors['chassis_number'] = "Chassis number cannot exceed 50 characters."
        elif self.bus_repository and self.bus_repository.exists_by_chassis_number(chassis_number, exclude_bus_id):
            errors['chassis_number'] = "This chassis number already exists."

        engine_number = str(data.get('engine_number', '') or '').strip()
        if not engine_number:
            errors['engine_number'] = "Engine number is required."
        elif len(engine_number) > 50:
            errors['engine_number'] = "Engine number cannot exceed 50 characters."
        elif self.bus_repository and self.bus_repository.exists_by_engine_number(engine_number, exclude_bus_id):
            errors['engine_number'] = "This engine number already exists."

        manufacture_year = data.get('manufacture_year')
        if not manufacture_year and manufacture_year != 0:
            errors['manufacture_year'] = "Manufacture year is required."
        else:
            try:
                year = int(manufacture_year)
                current_year = datetime.now().year
                if year < 1950 or year > current_year + 1:
                    errors['manufacture_year'] = f"Manufacture year must be between 1950 and {current_year + 1}."
            except (ValueError, TypeError):
                errors['manufacture_year'] = "Manufacture year must be a valid number."

        capacity = data.get('capacity')
        if capacity is None or capacity == '':
            errors['capacity'] = "Seating capacity is required."
        else:
            try:
                cap = int(capacity)
                if cap <= 0:
                    errors['capacity'] = "Seating capacity must be greater than zero."
            except (ValueError, TypeError):
                errors['capacity'] = "Seating capacity must be a valid integer."

        standing_capacity = data.get('standing_capacity')
        if standing_capacity is None or standing_capacity == '':
            errors['standing_capacity'] = "Standing capacity is required."
        else:
            try:
                scap = int(standing_capacity)
                if scap < 0:
                    errors['standing_capacity'] = "Standing capacity must be zero or greater."
            except (ValueError, TypeError):
                errors['standing_capacity'] = "Standing capacity must be a valid integer."

        fuel_type = data.get('fuel_type')
        if not fuel_type:
            errors['fuel_type'] = "Fuel type is required."
        elif fuel_type not in Bus.ALLOWED_FUEL_TYPES:
            errors['fuel_type'] = f"Invalid fuel type. Allowed values: {', '.join(Bus.ALLOWED_FUEL_TYPES)}"

        status = data.get('status')
        if not status:
            errors['status'] = "Status is required."
        elif status not in Bus.ALLOWED_STATUSES:
            errors['status'] = f"Status must be one of: {', '.join(Bus.ALLOWED_STATUSES)}"

        return errors
