class SensorData:
    def __init__(self, sensor_data_id=None, device_id=None, bus_id=None, roadside_unit_id=None,
                 front_approach_speed_kmh=None, right_approach_speed_kmh=None, left_approach_speed_kmh=None):
        self._sensor_data_id = sensor_data_id
        self._device_id = device_id
        self._bus_id = bus_id
        self._roadside_unit_id = roadside_unit_id
        self.front_approach_speed_kmh = front_approach_speed_kmh
        self.right_approach_speed_kmh = right_approach_speed_kmh
        self.left_approach_speed_kmh = left_approach_speed_kmh

    @property
    def front_approach_speed_kmh(self):
        return self._front_approach_speed_kmh

    @front_approach_speed_kmh.setter
    def front_approach_speed_kmh(self, value):
        if value is not None and float(value) < 0:
            raise ValueError("Front approach speed cannot be negative.")
        self._front_approach_speed_kmh = float(value) if value is not None else None

    @property
    def right_approach_speed_kmh(self):
        return self._right_approach_speed_kmh

    @right_approach_speed_kmh.setter
    def right_approach_speed_kmh(self, value):
        if value is not None and float(value) < 0:
            raise ValueError("Right approach speed cannot be negative.")
        self._right_approach_speed_kmh = float(value) if value is not None else None

    @property
    def left_approach_speed_kmh(self):
        return self._left_approach_speed_kmh

    @left_approach_speed_kmh.setter
    def left_approach_speed_kmh(self, value):
        if value is not None and float(value) < 0:
            raise ValueError("Left approach speed cannot be negative.")
        self._left_approach_speed_kmh = float(value) if value is not None else None

    def to_dict(self):
        return {
            'sensor_data_id': self._sensor_data_id,
            'device_id': self._device_id,
            'bus_id': self._bus_id,
            'roadside_unit_id': self._roadside_unit_id,
            'front_approach_speed_kmh': self._front_approach_speed_kmh,
            'right_approach_speed_kmh': self._right_approach_speed_kmh,
            'left_approach_speed_kmh': self._left_approach_speed_kmh
        }
