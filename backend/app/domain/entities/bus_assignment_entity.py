from datetime import datetime, date, timezone

class BusAssignment:
    def __init__(self, assignment_id=None, bus_id=None, driver_id=None, route_id=None, assigned_date=None, status="Active", created_at=None):
        self._assignment_id = assignment_id
        self._bus_id = bus_id
        self._driver_id = driver_id
        self._route_id = route_id
        self._assigned_date = assigned_date or date.today()
        self._status = status
        self._created_at = created_at or datetime.now(timezone.utc)

    @property
    def assignment_id(self):
        return self._assignment_id

    @property
    def bus_id(self):
        return self._bus_id

    @property
    def driver_id(self):
        return self._driver_id

    @property
    def route_id(self):
        return self._route_id

    @property
    def assigned_date(self):
        return self._assigned_date

    @property
    def status(self):
        return self._status

    @property
    def created_at(self):
        return self._created_at

    def to_dict(self):
        return {
            'assignment_id': self._assignment_id,
            'bus_id': self._bus_id,
            'driver_id': self._driver_id,
            'route_id': self._route_id,
            'assigned_date': str(self._assigned_date) if self._assigned_date else None,
            'status': self._status,
            'created_at': self._created_at.strftime('%Y-%m-%d %H:%M:%S') if isinstance(self._created_at, datetime) else str(self._created_at)
        }
