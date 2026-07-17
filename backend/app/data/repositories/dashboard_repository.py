from app.data.repositories.base_repository import BaseRepository
from app.data.models.bus_model import BusModel
from app.data.models.driver_model import DriverModel
from app.data.models.route_model import RouteModel
from app.data.models.assignment_model import BusAssignmentModel
from app.data.models.activity_log_model import UserActivityLogModel
from app.data.database import db

class DashboardRepository(BaseRepository):

    def get_by_id(self, entity_id):
        pass

    def get_all(self):
        pass

    def create(self, data):
        pass

    def update(self, entity_id, data):
        pass

    def delete(self, entity_id):
        pass

    def get_summary_stats(self):
        total_buses = BusModel.query.count()
        total_drivers = DriverModel.query.count()
        total_routes = RouteModel.query.count()

        active_buses = BusModel.query.filter_by(status='Active').count()
        buses_in_maintenance = BusModel.query.filter_by(status='Maintenance').count()
        inactive_buses = BusModel.query.filter_by(status='Inactive').count()

        active_drivers = DriverModel.query.filter_by(status='Active').count()
        inactive_drivers = DriverModel.query.filter_by(status='Inactive').count()
        
        # Drivers on leave approximated by total active drivers not currently assigned to active trips
        assigned_driver_ids = [a.driver_id for a in BusAssignmentModel.query.filter_by(status='Active').all()]
        drivers_on_leave = DriverModel.query.filter(
            DriverModel.driver_id.notin_(assigned_driver_ids),
            DriverModel.status == 'Active'
        ).count() if assigned_driver_ids else DriverModel.query.filter_by(status='Active').count()

        assigned_drivers_count = len(set(assigned_driver_ids))
        available_drivers = max(0, total_drivers - assigned_drivers_count)

        active_routes_count = RouteModel.query.filter_by(status='Active').count()
        inactive_routes_count = RouteModel.query.filter_by(status='Inactive').count()

        return {
            'totalBuses': total_buses,
            'totalDrivers': total_drivers,
            'totalRoutes': total_routes,
            'activeBuses': active_buses,
            'busesInMaintenance': buses_in_maintenance,
            'inactiveBuses': inactive_buses,
            'activeDrivers': active_drivers,
            'driversOnLeave': drivers_on_leave,
            'inactiveDrivers': inactive_drivers,
            'assignedDrivers': assigned_drivers_count,
            'availableDrivers': available_drivers,
            'activeRoutes': active_routes_count,
            'inactiveRoutes': inactive_routes_count
        }

    def get_latest_registered_buses_raw(self, limit=10):
        assignments = BusAssignmentModel.query.order_by(BusAssignmentModel.created_at.desc()).limit(limit).all()
        result = []
        for a in assignments:
            result.append({
                'bus_number': a.bus.bus_number if a.bus else 'N/A',
                'registration_number': a.bus.registration_number if a.bus else 'N/A',
                'route_name': f"{a.route.route_number} - {a.route.start_location} to {a.route.end_location}" if a.route else 'N/A',
                'driver_name': a.driver.full_name if a.driver else 'N/A',
                'status': a.bus.status if a.bus else 'Active',
                'registered_on': a.created_at.strftime('%b %d, %Y') if a.created_at else ''
            })
        if not result:
            buses = BusModel.query.order_by(BusModel.created_at.desc()).limit(limit).all()
            for b in buses:
                result.append({
                    'bus_number': b.bus_number,
                    'registration_number': b.registration_number,
                    'route_name': 'Unassigned',
                    'driver_name': 'Unassigned',
                    'status': b.status,
                    'registered_on': b.created_at.strftime('%b %d, %Y') if b.created_at else ''
                })
        return result

    def get_recent_activities_raw(self, limit=10):
        logs = UserActivityLogModel.query.order_by(UserActivityLogModel.activity_time.desc()).limit(limit).all()
        return [l.to_dict() for l in logs]
