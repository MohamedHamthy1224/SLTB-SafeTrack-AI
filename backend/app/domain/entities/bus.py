class Bus:
    ALLOWED_SERVICE_TYPES = [
        "Public Service", "Semi Luxury", "Luxury", "Express",
        "Intercity", "Highway", "School Service", "Staff Service", "Tourist"
    ]
    ALLOWED_FUEL_TYPES = ["Diesel", "Petrol", "Electric", "Hybrid", "CNG"]
    ALLOWED_STATUSES = ["Active", "Maintenance", "Inactive"]

    def __init__(
        self,
        bus_id=None,
        bus_number="",
        registration_number="",
        service_type="Public Service",
        depot="",
        model="",
        chassis_number="",
        engine_number="",
        capacity=0,
        standing_capacity=0,
        fuel_type="Diesel",
        manufacture_year=None,
        status="Active",
        created_at=None,
        registration_date=None
    ):
        self._bus_id = bus_id
        self.bus_number = bus_number
        self.registration_number = registration_number
        self.service_type = service_type
        self._depot = depot
        self.model = model
        self.chassis_number = chassis_number
        self.engine_number = engine_number
        self.capacity = capacity
        self.standing_capacity = standing_capacity
        self.fuel_type = fuel_type
        self.manufacture_year = manufacture_year
        self.status = status
        self._created_at = created_at
        self._registration_date = registration_date

    @property
    def bus_id(self):
        return self._bus_id

    @property
    def bus_number(self):
        return self._bus_number

    @bus_number.setter
    def bus_number(self, value):
        if not value or not str(value).strip():
            raise ValueError("Bus number cannot be blank.")
        self._bus_number = str(value).strip()

    @property
    def registration_number(self):
        return self._registration_number

    @registration_number.setter
    def registration_number(self, value):
        if not value or not str(value).strip():
            raise ValueError("Registration number cannot be blank.")
        self._registration_number = str(value).strip()

    @property
    def service_type(self):
        return self._service_type

    @service_type.setter
    def service_type(self, value):
        if value and value not in self.ALLOWED_SERVICE_TYPES:
            raise ValueError(f"Invalid service type: {value}")
        self._service_type = value

    @property
    def depot(self):
        return self._depot

    @depot.setter
    def depot(self, value):
        self._depot = str(value).strip() if value else ""

    @property
    def model(self):
        return self._model

    @model.setter
    def model(self, value):
        self._model = str(value).strip() if value else ""

    @property
    def chassis_number(self):
        return self._chassis_number

    @chassis_number.setter
    def chassis_number(self, value):
        self._chassis_number = str(value).strip() if value else ""

    @property
    def engine_number(self):
        return self._engine_number

    @engine_number.setter
    def engine_number(self, value):
        self._engine_number = str(value).strip() if value else ""

    @property
    def capacity(self):
        return self._capacity

    @capacity.setter
    def capacity(self, value):
        val = int(value) if value is not None else 0
        if val <= 0:
            raise ValueError("Seating capacity must be greater than zero.")
        self._capacity = val

    @property
    def standing_capacity(self):
        return self._standing_capacity

    @standing_capacity.setter
    def standing_capacity(self, value):
        val = int(value) if value is not None else 0
        if val < 0:
            raise ValueError("Standing capacity must be zero or greater.")
        self._standing_capacity = val

    @property
    def total_capacity(self):
        return self._capacity + self._standing_capacity

    @property
    def fuel_type(self):
        return self._fuel_type

    @fuel_type.setter
    def fuel_type(self, value):
        if value and value not in self.ALLOWED_FUEL_TYPES:
            raise ValueError(f"Invalid fuel type: {value}")
        self._fuel_type = value

    @property
    def manufacture_year(self):
        return self._manufacture_year

    @manufacture_year.setter
    def manufacture_year(self, value):
        self._manufacture_year = value

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, value):
        if value and value not in self.ALLOWED_STATUSES:
            raise ValueError(f"Invalid status: {value}")
        self._status = value or "Active"

    @property
    def created_at(self):
        return self._created_at

    @property
    def registration_date(self):
        return self._registration_date

    def to_dict(self):
        return {
            'bus_id': self._bus_id,
            'bus_number': self._bus_number,
            'registration_number': self._registration_number,
            'service_type': self._service_type,
            'depot': self._depot,
            'model': self._model,
            'chassis_number': self._chassis_number,
            'engine_number': self._engine_number,
            'capacity': self._capacity,
            'standing_capacity': self._standing_capacity,
            'total_capacity': self.total_capacity,
            'fuel_type': self._fuel_type,
            'manufacture_year': self._manufacture_year,
            'status': self._status,
            'created_at': self._created_at,
            'registration_date': self._registration_date
        }
