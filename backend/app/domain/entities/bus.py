class Bus:
    def __init__(self, bus_id=None, registration_number="", bus_number="", capacity=0, status="Active", depot="", model="", manufacture_year=None):
        self._bus_id = bus_id
        self._registration_number = registration_number
        self._bus_number = bus_number
        self.capacity = capacity
        self._status = status
        self._depot = depot
        self._model = model
        self._manufacture_year = manufacture_year

    @property
    def bus_id(self):
        return self._bus_id

    @property
    def registration_number(self):
        return self._registration_number

    @property
    def bus_number(self):
        return self._bus_number

    @property
    def capacity(self):
        return self._capacity

    @capacity.setter
    def capacity(self, value):
        if value is not None and int(value) <= 0:
            raise ValueError("Bus capacity must be greater than zero.")
        self._capacity = int(value) if value is not None else 0

    @property
    def status(self):
        return self._status

    def to_dict(self):
        return {
            'bus_id': self._bus_id,
            'registration_number': self._registration_number,
            'bus_number': self._bus_number,
            'capacity': self._capacity,
            'status': self._status,
            'depot': self._depot,
            'model': self._model,
            'manufacture_year': self._manufacture_year
        }
