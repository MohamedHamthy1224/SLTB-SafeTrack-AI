class Driver:
    def __init__(self, driver_id=None, full_name="", license_number="", experience_years=0, status="Active", nic="", phone=""):
        self._driver_id = driver_id
        self._full_name = full_name
        self._license_number = license_number
        self.experience_years = experience_years
        self._status = status
        self._nic = nic
        self._phone = phone

    @property
    def driver_id(self):
        return self._driver_id

    @property
    def full_name(self):
        return self._full_name

    @property
    def license_number(self):
        return self._license_number

    @property
    def experience_years(self):
        return self._experience_years

    @experience_years.setter
    def experience_years(self, value):
        if value is not None and int(value) < 0:
            raise ValueError("Driver experience years cannot be negative.")
        self._experience_years = int(value) if value is not None else 0

    def to_dict(self):
        return {
            'driver_id': self._driver_id,
            'full_name': self._full_name,
            'license_number': self._license_number,
            'experience_years': self._experience_years,
            'status': self._status,
            'nic': self._nic,
            'phone': self._phone
        }
