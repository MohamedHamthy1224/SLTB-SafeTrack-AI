class Route:
    def __init__(self, route_id=None, route_number="", route_name="", distance_km=0.0, status="Active", start_location="", end_location="", estimated_duration=0):
        self._route_id = route_id
        self._route_number = route_number
        self._route_name = route_name
        self.distance_km = distance_km
        self._status = status
        self._start_location = start_location
        self._end_location = end_location
        self._estimated_duration = estimated_duration

    @property
    def route_id(self):
        return self._route_id

    @property
    def route_number(self):
        return self._route_number

    @property
    def distance_km(self):
        return self._distance_km

    @distance_km.setter
    def distance_km(self, value):
        if value is not None and float(value) < 0:
            raise ValueError("Route distance cannot be negative.")
        self._distance_km = float(value) if value is not None else 0.0

    def to_dict(self):
        return {
            'route_id': self._route_id,
            'route_number': self._route_number,
            'route_name': self._route_name,
            'distance_km': self._distance_km,
            'status': self._status,
            'start_location': self._start_location,
            'end_location': self._end_location,
            'estimated_duration': self._estimated_duration
        }
