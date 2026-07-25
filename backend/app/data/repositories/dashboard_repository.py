from sqlalchemy import func
from app.data.repositories.base_repository import BaseRepository
from app.data.models.bus_model import BusModel
from app.data.models.driver_model import DriverModel
from app.data.models.route_model import RouteModel
from app.data.database import db

class DashboardRepository(BaseRepository):

    def get_by_id(self, entity_id):
        pass

    def get_all(self):
        pass

    def create(self, data, *args, **kwargs):
        pass

    def update(self, entity_id, data, *args, **kwargs):
        pass

    def delete(self, entity_id, *args, **kwargs):
        pass

    def get_bus_stats(self):
        total = BusModel.query.count()
        active = BusModel.query.filter_by(status='Active').count()
        maintenance = BusModel.query.filter_by(status='Maintenance').count()
        inactive = BusModel.query.filter_by(status='Inactive').count()
        return {
            'total': total,
            'active': active,
            'maintenance': maintenance,
            'inactive': inactive
        }

    def get_route_stats(self):
        total = RouteModel.query.count()
        active = RouteModel.query.filter_by(status='Active').count()
        inactive = RouteModel.query.filter_by(status='Inactive').count()
        return {
            'total': total,
            'active': active,
            'inactive': inactive
        }

    def get_driver_stats(self):
        total = DriverModel.query.count()
        active = DriverModel.query.filter_by(status='Active').count()
        inactive = DriverModel.query.filter_by(status='Inactive').count()
        return {
            'total': total,
            'active': active,
            'inactive': inactive
        }

    def get_buses_by_service_type_raw(self):
        results = db.session.query(
            BusModel.service_type,
            func.count(BusModel.bus_id)
        ).group_by(BusModel.service_type).all()

        return [{'service_type': st or 'Not Specified', 'count': count} for st, count in results]

    def get_buses_by_fuel_type_raw(self):
        results = db.session.query(
            BusModel.fuel_type,
            func.count(BusModel.bus_id)
        ).group_by(BusModel.fuel_type).all()

        return [{'fuel_type': ft or 'Not Specified', 'count': count} for ft, count in results]

    def get_buses_by_manufacture_year_raw(self):
        results = db.session.query(
            BusModel.manufacture_year,
            func.count(BusModel.bus_id)
        ).group_by(BusModel.manufacture_year).all()

        return [{'year': year, 'count': count} for year, count in results]

    def get_routes_for_distance_sorting(self):
        routes = RouteModel.query.filter(RouteModel.distance_km.isnot(None)).all()
        result = []
        for r in routes:
            try:
                dist = float(r.distance_km)
            except (ValueError, TypeError):
                continue
            result.append({
                'route_id': r.route_id,
                'route_number': r.route_number or 'N/A',
                'route_name': r.route_name or f"{r.start_location} - {r.end_location}",
                'distance_km': dist
            })
        return result

    def get_summary_stats(self):
        b = self.get_bus_stats()
        r = self.get_route_stats()
        d = self.get_driver_stats()
        return {
            'totalBuses': b['total'],
            'totalDrivers': d['total'],
            'totalRoutes': r['total'],
            'activeBuses': b['active'],
            'busesInMaintenance': b['maintenance'],
            'inactiveBuses': b['inactive'],
            'activeDrivers': d['active'],
            'inactiveDrivers': d['inactive'],
            'activeRoutes': r['active'],
            'inactiveRoutes': r['inactive']
        }
