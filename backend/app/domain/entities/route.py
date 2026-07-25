from datetime import datetime

class Route:
    """
    Route Domain Entity with protected attributes and getters/setters enforcing encapsulation.
    """

    def __init__(
        self,
        route_id=None,
        route_number="",
        route_name="",
        start_location="",
        end_location="",
        distance_km=0.0,
        estimated_duration=0,
        status="Active",
        created_at=None
    ):
        self._route_id = route_id
        self._route_number = route_number
        self._route_name = route_name
        self._start_location = start_location
        self._end_location = end_location
        self._distance_km = float(distance_km) if distance_km is not None else 0.0
        self._estimated_duration = int(estimated_duration) if estimated_duration is not None else 0
        self._status = status
        self._created_at = created_at

    @property
    def route_id(self):
        return self._route_id

    @property
    def route_number(self):
        return self._route_number

    @route_number.setter
    def route_number(self, value):
        if not value or not str(value).strip():
            raise ValueError("Route number must not be empty.")
        self._route_number = str(value).strip()

    @property
    def route_name(self):
        return self._route_name

    @route_name.setter
    def route_name(self, value):
        if not value or not str(value).strip():
            raise ValueError("Route name must not be empty.")
        self._route_name = str(value).strip()

    @property
    def start_location(self):
        return self._start_location

    @start_location.setter
    def start_location(self, value):
        if not value or not str(value).strip():
            raise ValueError("Start location must not be empty.")
        self._start_location = str(value).strip()

    @property
    def end_location(self):
        return self._end_location

    @end_location.setter
    def end_location(self, value):
        if not value or not str(value).strip():
            raise ValueError("End location must not be empty.")
        val_clean = str(value).strip()
        if self._start_location and val_clean.lower() == self._start_location.lower():
            raise ValueError("Start and end locations must not be identical.")
        self._end_location = val_clean

    @property
    def distance_km(self):
        return self._distance_km

    @distance_km.setter
    def distance_km(self, value):
        val = float(value) if value is not None else 0.0
        if val <= 0:
            raise ValueError("Distance must be greater than zero.")
        self._distance_km = val

    @property
    def estimated_duration(self):
        return self._estimated_duration

    @estimated_duration.setter
    def estimated_duration(self, value):
        val = int(value) if value is not None else 0
        if val <= 0:
            raise ValueError("Estimated duration must be greater than zero.")
        self._estimated_duration = val

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, value):
        if value not in ('Active', 'Inactive'):
            raise ValueError("Status must be Active or Inactive.")
        self._status = value

    @property
    def created_at(self):
        return self._created_at

    @property
    def formatted_duration(self):
        mins = self._estimated_duration
        if not mins or mins <= 0:
            return "0m"
        hours = mins // 60
        remaining_mins = mins % 60
        if hours > 0 and remaining_mins > 0:
            return f"{hours}h {remaining_mins}m"
        elif hours > 0:
            return f"{hours}h"
        return f"{remaining_mins}m"

    def to_dict(self):
        created_str = None
        if self._created_at:
            if isinstance(self._created_at, datetime):
                created_str = self._created_at.strftime('%Y-%m-%d %H:%M:%S')
            else:
                created_str = str(self._created_at)

        return {
            'route_id': self._route_id,
            'route_number': self._route_number,
            'route_name': self._route_name,
            'start_location': self._start_location,
            'end_location': self._end_location,
            'distance_km': self._distance_km,
            'estimated_duration': self._estimated_duration,
            'formatted_duration': self.formatted_duration,
            'status': self._status,
            'created_at': created_str,
            # Aliases for camelCase frontend compatibility
            'routeId': self._route_id,
            'routeNumber': self._route_number,
            'routeName': self._route_name,
            'startLocation': self._start_location,
            'endLocation': self._end_location,
            'distanceKm': self._distance_km,
            'estimatedDuration': self._estimated_duration,
            'formattedDuration': self.formatted_duration,
            'createdAt': created_str
        }
