from app.data.database import db
from app.data.models.roadside_unit_model import RoadsideUnitModel
from app.data.models.device_registry_model import DeviceRegistryModel
from app.data.models.route_model import RouteModel
from app.data.repositories.base_repository import BaseRepository
from sqlalchemy import func, or_, cast, String
from datetime import datetime, date

class RoadsideUnitRepository(BaseRepository):
    """
    RoadsideUnitRepository handling database access for roadside_units table.
    """

    def get_by_id(self, entity_id):
        return db.session.query(RoadsideUnitModel).filter(
            RoadsideUnitModel.roadside_unit_id == entity_id
        ).first()

    def get_all(self, keyword=None, status=None, route_id=None):
        query = db.session.query(RoadsideUnitModel).outerjoin(
            RouteModel, RouteModel.route_id == RoadsideUnitModel.route_id
        ).outerjoin(
            DeviceRegistryModel, DeviceRegistryModel.device_id == RoadsideUnitModel.device_id
        )

        if keyword and str(keyword).strip():
            k = f"%{str(keyword).strip()}%"
            query = query.filter(
                or_(
                    RoadsideUnitModel.location_name.ilike(k),
                    cast(RoadsideUnitModel.roadside_unit_id, String).ilike(k),
                    DeviceRegistryModel.device_code.ilike(k),
                    DeviceRegistryModel.device_name.ilike(k)
                )
            )

        if status and str(status).strip() and str(status).lower() not in ('all', 'all status'):
            query = query.filter(RoadsideUnitModel.status == str(status).strip())

        if route_id and str(route_id).strip() and str(route_id).lower() not in ('all', 'all routes'):
            try:
                # Handle raw route ID or formatted route strings (e.g. "ROU-1", "Route 1")
                cleaned_val = str(route_id).replace('ROU-', '').replace('Route', '').strip()
                if cleaned_val.isdigit():
                    query = query.filter(RoadsideUnitModel.route_id == int(cleaned_val))
                else:
                    # Match by route_number or route_name
                    query = query.filter(
                        or_(
                            RouteModel.route_number == str(route_id).strip(),
                            RouteModel.route_name.ilike(f"%{str(route_id).strip()}%")
                        )
                    )
            except Exception:
                pass

        return query.order_by(RoadsideUnitModel.roadside_unit_id.asc()).all()

    def get_summary(self):
        total = db.session.query(func.count(RoadsideUnitModel.roadside_unit_id)).scalar() or 0
        active = db.session.query(func.count(RoadsideUnitModel.roadside_unit_id)).filter(
            RoadsideUnitModel.status == 'Active'
        ).scalar() or 0
        inactive = db.session.query(func.count(RoadsideUnitModel.roadside_unit_id)).filter(
            RoadsideUnitModel.status == 'Inactive'
        ).scalar() or 0
        maintenance = db.session.query(func.count(RoadsideUnitModel.roadside_unit_id)).filter(
            RoadsideUnitModel.status == 'Maintenance'
        ).scalar() or 0

        active_pct = round((active / total * 100), 1) if total > 0 else 0.0
        inactive_pct = round((inactive / total * 100), 1) if total > 0 else 0.0
        maint_pct = round((maintenance / total * 100), 1) if total > 0 else 0.0

        return {
            'total': total,
            'totalUnits': total,
            'active': active,
            'activeUnits': active,
            'activePercentage': active_pct,
            'inactive': inactive,
            'inactiveUnits': inactive,
            'inactivePercentage': inactive_pct,
            'maintenance': maintenance,
            'maintenanceUnits': maintenance,
            'maintenancePercentage': maint_pct
        }

    def get_statuses(self):
        statuses = db.session.query(RoadsideUnitModel.status).distinct().all()
        result = [s[0] for s in statuses if s[0]]
        canonical = ["Active", "Inactive", "Maintenance"]
        ordered = []
        for expected in canonical:
            if expected in result and expected not in ordered:
                ordered.append(expected)
        for r in result:
            if r not in ordered:
                ordered.append(r)
        if not ordered:
            ordered = canonical
        return ordered

    def get_routes(self):
        routes = db.session.query(RouteModel).order_by(RouteModel.route_number.asc()).all()
        return [
            {
                'routeId': r.route_id,
                'route_id': r.route_id,
                'routeNumber': r.route_number,
                'route_number': r.route_number,
                'routeName': r.route_name,
                'route_name': r.route_name,
                'startLocation': r.start_location,
                'endLocation': r.end_location,
                'status': r.status,
                'displayText': f"{r.route_number} - {r.route_name}" if r.route_number else r.route_name
            }
            for r in routes
        ]

    def get_devices(self):
        # Get devices registered as Roadside Unit or currently linked
        devices = db.session.query(DeviceRegistryModel).filter(
            or_(
                DeviceRegistryModel.device_type == 'Roadside Unit',
                DeviceRegistryModel.device_id.in_(
                    db.session.query(RoadsideUnitModel.device_id)
                )
            )
        ).order_by(DeviceRegistryModel.device_id.asc()).all()

        return [
            {
                'deviceId': d.device_id,
                'device_id': d.device_id,
                'deviceCode': d.device_code,
                'device_code': d.device_code,
                'deviceName': d.device_name,
                'device_name': d.device_name,
                'deviceType': d.device_type,
                'status': d.status,
                'isOnline': bool(d.is_online),
                'displayText': f"{d.device_code} ({d.device_name})" if d.device_name else d.device_code
            }
            for d in devices
        ]

    def create(self, data, commit=False):
        inst_date = data.get('installationDate') or data.get('installation_date')
        if isinstance(inst_date, str) and inst_date.strip():
            try:
                inst_date = datetime.strptime(inst_date.strip(), '%Y-%m-%d').date()
            except ValueError:
                inst_date = None
        elif not isinstance(inst_date, date):
            inst_date = None

        lat = data.get('latitude')
        lng = data.get('longitude')
        lat_val = float(lat) if (lat is not None and str(lat).strip() != '') else None
        lng_val = float(lng) if (lng is not None and str(lng).strip() != '') else None

        route_id_val = data.get('routeId') or data.get('route_id')
        if route_id_val is not None and str(route_id_val).strip() != '' and str(route_id_val).strip().lower() != 'none':
            try:
                route_id_val = int(route_id_val)
            except (ValueError, TypeError):
                route_id_val = None
        else:
            route_id_val = None

        device_id_val = data.get('deviceId') or data.get('device_id')
        if device_id_val is not None:
            device_id_val = int(device_id_val)

        unit = RoadsideUnitModel(
            device_id=device_id_val,
            route_id=route_id_val,
            location_name=str(data.get('locationName') or data.get('location_name') or '').strip(),
            latitude=lat_val,
            longitude=lng_val,
            installation_date=inst_date,
            status=data.get('status') or 'Active'
        )
        db.session.add(unit)
        if commit:
            db.session.commit()
        else:
            db.session.flush()
        return unit

    def update(self, entity_id, data, commit=False):
        unit = self.get_by_id(entity_id)
        if not unit:
            return None

        if 'deviceId' in data or 'device_id' in data:
            val = data.get('deviceId') if 'deviceId' in data else data.get('device_id')
            if val is not None and str(val).strip() != '':
                unit.device_id = int(val)

        if 'routeId' in data or 'route_id' in data:
            val = data.get('routeId') if 'routeId' in data else data.get('route_id')
            if val is not None and str(val).strip() != '' and str(val).strip().lower() != 'none':
                try:
                    unit.route_id = int(val)
                except (ValueError, TypeError):
                    unit.route_id = None
            else:
                unit.route_id = None

        if 'locationName' in data or 'location_name' in data:
            val = data.get('locationName') if 'locationName' in data else data.get('location_name')
            if val is not None:
                unit.location_name = str(val).strip()

        if 'latitude' in data:
            val = data.get('latitude')
            if val is not None and str(val).strip() != '':
                unit.latitude = float(val)
            else:
                unit.latitude = None

        if 'longitude' in data:
            val = data.get('longitude')
            if val is not None and str(val).strip() != '':
                unit.longitude = float(val)
            else:
                unit.longitude = None

        if 'installationDate' in data or 'installation_date' in data:
            inst_date = data.get('installationDate') if 'installationDate' in data else data.get('installation_date')
            if isinstance(inst_date, str) and inst_date.strip():
                try:
                    inst_date = datetime.strptime(inst_date.strip(), '%Y-%m-%d').date()
                except ValueError:
                    inst_date = None
            elif not isinstance(inst_date, date):
                inst_date = None
            unit.installation_date = inst_date

        if 'status' in data:
            val = data.get('status')
            if val:
                unit.status = val

        if commit:
            db.session.commit()
        else:
            db.session.flush()
        return unit

    def set_inactive(self, entity_id, commit=False):
        unit = self.get_by_id(entity_id)
        if not unit:
            return None
        unit.status = 'Inactive'
        if commit:
            db.session.commit()
        else:
            db.session.flush()
        return unit

    def delete(self, entity_id, commit=True):
        unit = self.get_by_id(entity_id)
        if unit:
            db.session.delete(unit)
            if commit:
                db.session.commit()
            return True
        return False

    def commit(self):
        db.session.commit()

    def rollback(self):
        db.session.rollback()
