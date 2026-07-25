class BusAssignment:
    ALLOWED_STATUSES = ["Active", "Completed", "Cancelled"]

    def __init__(
        self,
        assignment_id=None,
        bus_id=None,
        driver_id=None,
        route_id=None,
        assigned_date=None,
        status="Active"
    ):
        self._assignment_id = assignment_id
        self._bus_id = bus_id
        self._driver_id = driver_id
        self._route_id = route_id
        self._assigned_date = assigned_date
        self.status = status

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

    @status.setter
    def status(self, value):
        if value and value not in self.ALLOWED_STATUSES:
            raise ValueError(f"Invalid assignment status: {value}")
        self._status = value or "Active"

    def to_dict(self):
        return {
            'assignment_id': self._assignment_id,
            'bus_id': self._bus_id,
            'driver_id': self._driver_id,
            'route_id': self._route_id,
            'assigned_date': str(self._assigned_date) if self._assigned_date else None,
            'status': self._status
        }
