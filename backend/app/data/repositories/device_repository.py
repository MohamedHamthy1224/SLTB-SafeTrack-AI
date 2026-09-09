from app.data.database import db
from app.data.models.device_registry_model import DeviceRegistryModel
from app.data.models.bus_device_model import BusDeviceModel
from app.data.models.bus_model import BusModel
from app.data.repositories.base_repository import BaseRepository
from sqlalchemy import func, or_
from datetime import datetime

class DeviceRepository(BaseRepository):

    def get_by_id(self, entity_id):
        return db.session.query(DeviceRegistryModel).filter(DeviceRegistryModel.device_id == entity_id).first()

    def get_by_code(self, device_code, exclude_id=None):
        if not device_code:
            return None
        query = db.session.query(DeviceRegistryModel).filter(
            func.lower(DeviceRegistryModel.device_code) == func.lower(device_code.strip())
        )
        if exclude_id:
            query = query.filter(DeviceRegistryModel.device_id != exclude_id)
        return query.first()

    def get_by_mac(self, mac_address, exclude_id=None):
        if not mac_address or not str(mac_address).strip():
            return None
        query = db.session.query(DeviceRegistryModel).filter(
            func.lower(DeviceRegistryModel.mac_address) == func.lower(mac_address.strip())
        )
        if exclude_id:
            query = query.filter(DeviceRegistryModel.device_id != exclude_id)
        return query.first()

    def get_all(self, keyword=None, device_type=None, status=None):
        query = db.session.query(DeviceRegistryModel)

        if keyword and str(keyword).strip():
            k = f"%{keyword.strip()}%"
            query = query.filter(
                or_(
                    DeviceRegistryModel.device_code.ilike(k),
                    DeviceRegistryModel.device_name.ilike(k)
                )
            )

        if device_type and str(device_type).strip() and str(device_type).lower() != 'all':
            query = query.filter(DeviceRegistryModel.device_type == device_type.strip())

        if status and str(status).strip() and str(status).lower() != 'all':
            query = query.filter(DeviceRegistryModel.status == status.strip())

        return query.order_by(DeviceRegistryModel.device_id.asc()).all()

    def get_summary(self):
        total_devices = db.session.query(func.count(DeviceRegistryModel.device_id)).scalar() or 0
        bus_units = db.session.query(func.count(DeviceRegistryModel.device_id)).filter(
            DeviceRegistryModel.device_type == 'Bus Unit'
        ).scalar() or 0
        roadside_units = db.session.query(func.count(DeviceRegistryModel.device_id)).filter(
            DeviceRegistryModel.device_type == 'Roadside Unit'
        ).scalar() or 0
        online_devices = db.session.query(func.count(DeviceRegistryModel.device_id)).filter(
            DeviceRegistryModel.is_online == True
        ).scalar() or 0
        maintenance_devices = db.session.query(func.count(DeviceRegistryModel.device_id)).filter(
            DeviceRegistryModel.status == 'Maintenance'
        ).scalar() or 0

        bus_pct = round((bus_units / total_devices * 100), 1) if total_devices > 0 else 0
        roadside_pct = round((roadside_units / total_devices * 100), 1) if total_devices > 0 else 0
        online_pct = round((online_devices / total_devices * 100), 1) if total_devices > 0 else 0
        maint_pct = round((maintenance_devices / total_devices * 100), 1) if total_devices > 0 else 0

        return {
            'total': total_devices,
            'totalDevices': total_devices,
            'busUnits': bus_units,
            'busPercentage': bus_pct,
            'roadsideUnits': roadside_units,
            'roadsidePercentage': roadside_pct,
            'online': online_devices,
            'onlineDevices': online_devices,
            'onlinePercentage': online_pct,
            'maintenance': maintenance_devices,
            'maintenanceDevices': maintenance_devices,
            'maintenancePercentage': maint_pct
        }

    def get_device_types(self):
        # Fetch distinct from table or fallback to enum specification
        types = db.session.query(DeviceRegistryModel.device_type).distinct().all()
        result = [t[0] for t in types if t[0]]
        if not result:
            result = ["Bus Unit", "Roadside Unit"]
        # Ensure canonical ordering
        ordered = []
        for expected in ["Bus Unit", "Roadside Unit"]:
            if expected in result and expected not in ordered:
                ordered.append(expected)
        for r in result:
            if r not in ordered:
                ordered.append(r)
        return ordered

    def get_device_statuses(self):
        statuses = db.session.query(DeviceRegistryModel.status).distinct().all()
        result = [s[0] for s in statuses if s[0]]
        if not result:
            result = ["Active", "Inactive", "Maintenance"]
        ordered = []
        for expected in ["Active", "Inactive", "Maintenance"]:
            if expected in result and expected not in ordered:
                ordered.append(expected)
        for r in result:
            if r not in ordered:
                ordered.append(r)
        return ordered

    def get_bus_device_statuses(self):
        return ["Active", "Inactive", "Removed"]

    def get_buses(self):
        buses = db.session.query(BusModel).order_by(BusModel.bus_number.asc()).all()
        return [
            {
                'busId': b.bus_id,
                'bus_id': b.bus_id,
                'busNumber': b.bus_number,
                'bus_number': b.bus_number,
                'registrationNumber': b.registration_number,
                'registration_number': b.registration_number,
                'status': b.status
            }
            for b in buses
        ]

    def create(self, data, commit=False):
        # Parse installation date if given
        inst_date = data.get('installationDate') or data.get('installation_date')
        if isinstance(inst_date, str) and inst_date.strip():
            try:
                inst_date = datetime.strptime(inst_date.strip(), '%Y-%m-%d').date()
            except ValueError:
                inst_date = None

        # Parse last seen if given
        last_seen = data.get('lastSeen') or data.get('last_seen')
        if isinstance(last_seen, str) and last_seen.strip():
            try:
                # Handle T or space separator
                clean_dt = last_seen.replace('T', ' ').strip()
                if len(clean_dt) == 16:
                    clean_dt += ':00'
                last_seen = datetime.strptime(clean_dt, '%Y-%m-%d %H:%M:%S')
            except ValueError:
                last_seen = None

        is_online_raw = data.get('isOnline') if 'isOnline' in data else data.get('is_online')
        if isinstance(is_online_raw, str):
            is_online = is_online_raw.lower() in ('true', '1', 'online', 'yes')
        else:
            is_online = bool(is_online_raw)

        device = DeviceRegistryModel(
            device_code=data.get('deviceCode') or data.get('device_code'),
            device_name=data.get('deviceName') or data.get('device_name'),
            device_type=data.get('deviceType') or data.get('device_type'),
            mac_address=data.get('macAddress') or data.get('mac_address') or None,
            ip_address=data.get('ipAddress') or data.get('ip_address') or None,
            firmware_version=data.get('firmwareVersion') or data.get('firmware_version') or None,
            installation_date=inst_date,
            last_seen=last_seen,
            is_online=is_online,
            status=data.get('status') or 'Active'
        )
        db.session.add(device)
        if commit:
            db.session.commit()
        else:
            db.session.flush()
        return device

    def update(self, entity_id, data, commit=False):
        device = self.get_by_id(entity_id)
        if not device:
            return None

        if 'deviceCode' in data or 'device_code' in data:
            device.device_code = data.get('deviceCode') or data.get('device_code')
        if 'deviceName' in data or 'device_name' in data:
            device.device_name = data.get('deviceName') or data.get('device_name')
        if 'deviceType' in data or 'device_type' in data:
            device.device_type = data.get('deviceType') or data.get('device_type')
        if 'macAddress' in data or 'mac_address' in data:
            device.mac_address = data.get('macAddress') or data.get('mac_address') or None
        if 'ipAddress' in data or 'ip_address' in data:
            device.ip_address = data.get('ipAddress') or data.get('ip_address') or None
        if 'firmwareVersion' in data or 'firmware_version' in data:
            device.firmware_version = data.get('firmwareVersion') or data.get('firmware_version') or None

        if 'installationDate' in data or 'installation_date' in data:
            inst_date = data.get('installationDate') or data.get('installation_date')
            if isinstance(inst_date, str) and inst_date.strip():
                try:
                    inst_date = datetime.strptime(inst_date.strip(), '%Y-%m-%d').date()
                except ValueError:
                    inst_date = None
            device.installation_date = inst_date

        if 'lastSeen' in data or 'last_seen' in data:
            last_seen = data.get('lastSeen') or data.get('last_seen')
            if isinstance(last_seen, str) and last_seen.strip():
                try:
                    clean_dt = last_seen.replace('T', ' ').strip()
                    if len(clean_dt) == 16:
                        clean_dt += ':00'
                    last_seen = datetime.strptime(clean_dt, '%Y-%m-%d %H:%M:%S')
                except ValueError:
                    last_seen = None
            device.last_seen = last_seen

        if 'isOnline' in data or 'is_online' in data:
            is_online_raw = data.get('isOnline') if 'isOnline' in data else data.get('is_online')
            if isinstance(is_online_raw, str):
                device.is_online = is_online_raw.lower() in ('true', '1', 'online', 'yes')
            else:
                device.is_online = bool(is_online_raw)

        if 'status' in data:
            device.status = data.get('status') or 'Active'

        if commit:
            db.session.commit()
        else:
            db.session.flush()
        return device

    def delete(self, entity_id, commit=True):
        device = self.get_by_id(entity_id)
        if device:
            db.session.delete(device)
            if commit:
                db.session.commit()
            return True
        return False

    def set_status_inactive(self, entity_id, commit=True):
        device = self.get_by_id(entity_id)
        if not device:
            return None
        device.status = 'Inactive'
        
        # Also set bus device assignment status to Inactive if exists
        bus_device = self.get_bus_device_by_device_id(entity_id)
        if bus_device:
            bus_device.status = 'Inactive'

        if commit:
            db.session.commit()
        else:
            db.session.flush()
        return device

    def get_bus_device_by_device_id(self, device_id):
        return db.session.query(BusDeviceModel).filter(BusDeviceModel.device_id == device_id).first()

    def create_bus_device(self, data, commit=False):
        inst_date = data.get('installedDate') or data.get('installed_date')
        if isinstance(inst_date, str) and inst_date.strip():
            try:
                inst_date = datetime.strptime(inst_date.strip(), '%Y-%m-%d').date()
            except ValueError:
                inst_date = None

        bus_id = data.get('busId') or data.get('bus_id')
        device_id = data.get('deviceId') or data.get('device_id')

        bus_device = BusDeviceModel(
            bus_id=int(bus_id),
            device_id=int(device_id),
            installation_location=data.get('installationLocation') or data.get('installation_location') or '',
            installed_date=inst_date,
            status=data.get('status') or 'Active'
        )
        db.session.add(bus_device)
        if commit:
            db.session.commit()
        else:
            db.session.flush()
        return bus_device

    def update_bus_device(self, device_id, data, commit=False):
        bus_device = self.get_bus_device_by_device_id(device_id)
        if not bus_device:
            # If not assigned yet, create assignment
            data_copy = dict(data)
            data_copy['deviceId'] = device_id
            return self.create_bus_device(data_copy, commit=commit)

        if 'busId' in data or 'bus_id' in data:
            val = data.get('busId') or data.get('bus_id')
            if val:
                bus_device.bus_id = int(val)

        if 'installationLocation' in data or 'installation_location' in data:
            bus_device.installation_location = data.get('installationLocation') or data.get('installation_location') or ''

        if 'installedDate' in data or 'installed_date' in data:
            inst_date = data.get('installedDate') or data.get('installed_date')
            if isinstance(inst_date, str) and inst_date.strip():
                try:
                    inst_date = datetime.strptime(inst_date.strip(), '%Y-%m-%d').date()
                except ValueError:
                    inst_date = None
            bus_device.installed_date = inst_date

        if 'status' in data:
            bus_device.status = data.get('status') or 'Active'

        if commit:
            db.session.commit()
        else:
            db.session.flush()
        return bus_device

    def commit(self):
        db.session.commit()

    def rollback(self):
        db.session.rollback()
