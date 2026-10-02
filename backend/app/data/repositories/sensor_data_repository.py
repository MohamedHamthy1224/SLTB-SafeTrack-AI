"""
Sensor Data Repository
======================
Data access layer for the sensor_data table.
Implements BaseRepository following the architecture:
Controller → Service → Repository → Model
"""

from app.data.database import db
from app.data.models.sensor_data_model import SensorDataModel
from app.data.repositories.base_repository import BaseRepository


class SensorDataRepository(BaseRepository):

    def get_by_id(self, entity_id):
        """Fetch a single sensor_data record by ID."""
        return db.session.query(SensorDataModel).filter(
            SensorDataModel.sensor_data_id == entity_id
        ).first()

    def get_all(self):
        """Fetch all sensor_data records ordered descending."""
        return db.session.query(SensorDataModel).order_by(
            SensorDataModel.sensor_data_id.desc()
        ).all()

    def get_latest_uturn_reading(self, device_id: int, roadside_unit_id: int, exclude_sensor_data_id: int | None = None):
        """
        Query the latest sensor_data record for the given device_id and roadside_unit_id.
        Optionally excludes exclude_sensor_data_id so that a newly flushed/added row
        is never mistakenly selected as the previous record.

        SQL Equivalent:
            SELECT * FROM sensor_data
            WHERE device_id = :device_id
              AND roadside_unit_id = :roadside_unit_id
              [AND sensor_data_id != :exclude_sensor_data_id]
            ORDER BY sensor_data_id DESC
            LIMIT 1;
        """
        query = db.session.query(SensorDataModel).filter(
            SensorDataModel.device_id == device_id,
            SensorDataModel.roadside_unit_id == roadside_unit_id
        )
        if exclude_sensor_data_id is not None:
            query = query.filter(SensorDataModel.sensor_data_id != exclude_sensor_data_id)

        return query.order_by(SensorDataModel.sensor_data_id.desc()).first()

    def create(self, data: dict, commit: bool = False):
        """Insert a new sensor_data row."""
        sensor = SensorDataModel(**data)
        db.session.add(sensor)
        if commit:
            db.session.commit()
        else:
            db.session.flush()
        return sensor

    def update(self, entity_id, data: dict, commit: bool = True):
        """Update an existing sensor_data row."""
        record = self.get_by_id(entity_id)
        if record:
            for key, val in data.items():
                if hasattr(record, key):
                    setattr(record, key, val)
            if commit:
                db.session.commit()
        return record

    def delete(self, entity_id, commit: bool = True):
        """Delete a sensor_data row."""
        record = self.get_by_id(entity_id)
        if record:
            db.session.delete(record)
            if commit:
                db.session.commit()
            return True
        return False
