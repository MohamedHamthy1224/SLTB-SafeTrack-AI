from app.data.database import db
from app.data.repositories.bus_repository import BusRepository
from app.data.repositories.assignment_repository import AssignmentRepository
from app.data.repositories.route_repository import RouteRepository
from app.data.repositories.driver_repository import DriverRepository
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.business.validators.bus_validator import BusValidator
from app.business.validators.assignment_validator import AssignmentValidator
from app.business.strategies.quick_sort_strategy import QuickSortStrategy
from app.business.strategies.merge_sort_strategy import MergeSortStrategy
from app.business.strategies.linear_search_strategy import LinearSearchStrategy
from app.business.strategies.binary_search_strategy import BinarySearchStrategy
from app.business.services.websocket_service import WebSocketService
from sqlalchemy.exc import SQLAlchemyError
from datetime import date
import math

class BusServiceError(Exception):
    def __init__(self, message, errors=None, status_code=400):
        super().__init__(message)
        self.message = message
        self.errors = errors or {}
        self.status_code = status_code

class BusService:

    def __init__(
        self,
        bus_repo=None,
        assignment_repo=None,
        route_repo=None,
        driver_repo=None,
        activity_repo=None,
        sort_strategy=None,
        search_strategy=None,
        websocket_service=None
    ):
        self.bus_repo = bus_repo or BusRepository()
        self.assignment_repo = assignment_repo or AssignmentRepository()
        self.route_repo = route_repo or RouteRepository()
        self.driver_repo = driver_repo or DriverRepository()
        self.activity_repo = activity_repo or ActivityLogRepository()
        self.sort_strategy = sort_strategy or QuickSortStrategy()
        self.merge_sort_strategy = MergeSortStrategy()
        self.search_strategy = search_strategy or LinearSearchStrategy()
        self.binary_strategy = BinarySearchStrategy()
        self.websocket_service = websocket_service or WebSocketService()

        self.bus_validator = BusValidator(self.bus_repo)
        self.assignment_validator = AssignmentValidator(
            self.route_repo, self.driver_repo, self.assignment_repo
        )

    def get_summary(self):
        return self.bus_repo.get_summary()

    def get_filter_options(self):
        routes = self.route_repo.get_active_routes()
        drivers = self.driver_repo.get_active_drivers()

        route_dicts = []
        seen_r_ids = set()
        for r in routes:
            if not r or r.route_id in seen_r_ids:
                continue
            seen_r_ids.add(r.route_id)
            d = r.to_dict()
            d['routeId'] = r.route_id
            d['routeNumber'] = r.route_number
            d['routeName'] = r.route_name
            d['startLocation'] = r.start_location
            d['endLocation'] = r.end_location
            route_dicts.append(d)

        driver_dicts = []
        seen_d_ids = set()
        for dr in drivers:
            if not dr or dr.driver_id in seen_d_ids:
                continue
            seen_d_ids.add(dr.driver_id)
            d = dr.to_dict()
            d['driverId'] = dr.driver_id
            d['fullName'] = dr.full_name
            d['licenseNumber'] = dr.license_number
            driver_dicts.append(d)

        # Sort dropdown options using MergeSortStrategy
        sorted_routes = self.merge_sort_strategy.sort(route_dicts, key_field='route_number')
        sorted_drivers = self.merge_sort_strategy.sort(driver_dicts, key_field='full_name')

        return {
            'routes': sorted_routes,
            'drivers': sorted_drivers,
            'statuses': ['Active', 'Maintenance', 'Inactive'],
            'serviceTypes': [
                "Public Service", "Semi Luxury", "Luxury", "Express",
                "Intercity", "Highway", "School Service", "Staff Service", "Tourist"
            ],
            'fuelTypes': ["Diesel", "Petrol", "Electric", "Hybrid", "CNG"]
        }

    def get_buses(self, params=None):
        params = params or {}
        search_query = str(params.get('search', '') or '').strip()
        route_id_filter = params.get('route_id')
        driver_id_filter = params.get('driver_id')
        status_filter = params.get('status')
        page = int(params.get('page', 1) or 1)
        per_page = int(params.get('per_page', 10) or 10)
        sort_by = params.get('sort_by', 'bus_number')
        order = params.get('order', 'asc')

        buses = self.bus_repo.get_all()

        bus_items = []
        for bus_model in buses:
            bus_dict = bus_model.to_dict()
            active_assignment = self.assignment_repo.get_active_by_bus(bus_model.bus_id)
            route = getattr(active_assignment, 'route', None) if active_assignment else None
            driver = getattr(active_assignment, 'driver', None) if active_assignment else None

            if active_assignment and route and driver:
                bus_dict['assignment'] = {
                    'assignmentId': active_assignment.assignment_id,
                    'busId': active_assignment.bus_id,
                    'routeId': active_assignment.route_id,
                    'route_id': active_assignment.route_id,
                    'routeNumber': route.route_number,
                    'route_number': route.route_number,
                    'routeName': route.route_name,
                    'route_name': route.route_name,
                    'startLocation': route.start_location,
                    'start_location': route.start_location,
                    'endLocation': route.end_location,
                    'end_location': route.end_location,
                    'driverId': active_assignment.driver_id,
                    'driver_id': active_assignment.driver_id,
                    'driverName': driver.full_name,
                    'full_name': driver.full_name,
                    'licenseNumber': driver.license_number,
                    'license_number': driver.license_number
                }
                bus_dict['routeDisplay'] = f"{route.route_number} - {route.start_location} to {route.end_location}"
                bus_dict['driverDisplay'] = driver.full_name
                bus_dict['routeId'] = active_assignment.route_id
                bus_dict['route_id'] = active_assignment.route_id
                bus_dict['driverId'] = active_assignment.driver_id
                bus_dict['driver_id'] = active_assignment.driver_id
            else:
                bus_dict['assignment'] = None
                bus_dict['routeDisplay'] = "Unassigned"
                bus_dict['driverDisplay'] = "Unassigned"
                bus_dict['routeId'] = None
                bus_dict['route_id'] = None
                bus_dict['driverId'] = None
                bus_dict['driver_id'] = None

            bus_items.append(bus_dict)

        # Apply filtering
        filtered_items = []
        for item in bus_items:
            # Route filter
            if route_id_filter and str(route_id_filter) != 'all' and str(route_id_filter) != '':
                bus_route_id = item.get('routeId') or item.get('route_id')
                if str(bus_route_id) != str(route_id_filter):
                    continue
            # Driver filter
            if driver_id_filter and str(driver_id_filter) != 'all' and str(driver_id_filter) != '':
                bus_driver_id = item.get('driverId') or item.get('driver_id')
                if str(bus_driver_id) != str(driver_id_filter):
                    continue
            # Status filter
            if status_filter and status_filter != 'All Status':
                if item.get('status') != status_filter:
                    continue

            filtered_items.append(item)

        # Apply searching strategy (Linear search for partial text or Binary search for exact match)
        if search_query:
            if search_query.isdigit() and len(search_query) <= 5:
                # Binary Search demonstration for integer search target
                sorted_by_id = self.merge_sort_strategy.sort(filtered_items, key_field='bus_id')
                searched = self.binary_strategy.search(sorted_by_id, search_query, key_field='bus_id')
                if not searched:
                    searched = self.search_strategy.search(filtered_items, search_query)
                filtered_items = searched
            else:
                filtered_items = self.search_strategy.search(filtered_items, search_query)

        # Apply sorting strategy (QuickSort algorithm)
        reverse = (order.lower() == 'desc')
        key_field_map = {
            'bus_number': 'bus_number',
            'registration_number': 'registration_number',
            'route': 'routeDisplay',
            'driver': 'driverDisplay',
            'service_type': 'service_type',
            'capacity': 'capacity',
            'status': 'status',
            'created_at': 'created_at'
        }
        sort_field = key_field_map.get(sort_by, 'bus_number')
        sorted_items = self.sort_strategy.sort(filtered_items, key_field=sort_field, reverse=reverse)

        total_items = len(sorted_items)
        total_pages = max(1, math.ceil(total_items / per_page))
        page = min(max(1, page), total_pages)

        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_items = sorted_items[start_idx:end_idx]

        return {
            'items': paginated_items,
            'pagination': {
                'page': page,
                'perPage': per_page,
                'totalItems': total_items,
                'totalPages': total_pages
            }
        }

    def get_bus_details(self, bus_id):
        bus_model = self.bus_repo.get_by_id(bus_id)
        if not bus_model:
            raise BusServiceError("Bus not found", status_code=404)

        bus_dict = bus_model.to_dict()
        active_assignment = self.assignment_repo.get_active_by_bus(bus_id)
        route = getattr(active_assignment, 'route', None) if active_assignment else None
        driver = getattr(active_assignment, 'driver', None) if active_assignment else None

        if active_assignment and route and driver:
            bus_dict['assignment'] = {
                'assignmentId': active_assignment.assignment_id,
                'busId': active_assignment.bus_id,
                'routeId': active_assignment.route_id,
                'routeNumber': route.route_number,
                'routeName': route.route_name,
                'startLocation': route.start_location,
                'endLocation': route.end_location,
                'driverId': active_assignment.driver_id,
                'driverName': driver.full_name,
                'licenseNumber': driver.license_number,
                'assignedDate': str(active_assignment.assigned_date) if active_assignment.assigned_date else None
            }
        else:
            bus_dict['assignment'] = None

        return bus_dict

    def _derive_depot_from_route(self, route_id):
        route = self.route_repo.get_by_id(route_id)
        if route and route.start_location:
            return f"SLTB Main Depot - {route.start_location}"
        return "SLTB Main Depot"

    def create_bus_with_assignment(self, bus_data, assignment_data, user_id=None):
        bus_errors = self.bus_validator.validate(bus_data)
        assignment_errors = self.assignment_validator.validate(assignment_data)

        combined_errors = {}
        if bus_errors:
            combined_errors.update(bus_errors)
        if assignment_errors:
            combined_errors.update(assignment_errors)

        if combined_errors:
            raise BusServiceError("Validation failed.", errors=combined_errors, status_code=400)

        route_id = int(assignment_data['route_id'])
        driver_id = int(assignment_data['driver_id'])

        # Auto-derive depot from selected route's start location
        depot_name = self._derive_depot_from_route(route_id)
        bus_data['depot'] = depot_name

        try:
            new_bus = self.bus_repo.create(bus_data, commit=False)
            db.session.flush()

            new_assignment = self.assignment_repo.create({
                'bus_id': new_bus.bus_id,
                'route_id': route_id,
                'driver_id': driver_id,
                'assigned_date': date.today(),
                'status': 'Active'
            }, commit=False)

            if user_id:
                self.activity_repo.create({
                    'user_id': user_id,
                    'activity': f"New bus {new_bus.bus_number} was registered and assigned to route {route_id}."
                })

            db.session.commit()

            summary = self.get_summary()

            # Emit real-time WebSocket events
            try:
                self.websocket_service.emit_bus_registered(new_bus.to_dict())
                self.websocket_service.emit_bus_assignment_updated(new_assignment.to_dict())
                self.websocket_service.emit_bus_summary_updated(summary)
            except Exception:
                pass

            return {
                'busId': new_bus.bus_id,
                'assignmentId': new_assignment.assignment_id,
                'routeId': route_id,
                'driverId': driver_id,
                'depot': depot_name
            }

        except SQLAlchemyError as error:
            db.session.rollback()
            raise BusServiceError("The bus and its route/driver assignment could not be saved.", status_code=500) from error

    def update_bus_with_assignment(self, bus_id, bus_data, assignment_data, user_id=None):
        bus_model = self.bus_repo.get_by_id(bus_id)
        if not bus_model:
            raise BusServiceError("Bus not found", status_code=404)

        bus_errors = self.bus_validator.validate(bus_data, exclude_bus_id=bus_id)
        assignment_errors = self.assignment_validator.validate(assignment_data, exclude_bus_id=bus_id)

        combined_errors = {}
        if bus_errors:
            combined_errors.update(bus_errors)
        if assignment_errors:
            combined_errors.update(assignment_errors)

        if combined_errors:
            raise BusServiceError("Validation failed.", errors=combined_errors, status_code=400)

        route_id = int(assignment_data['route_id'])
        driver_id = int(assignment_data['driver_id'])

        # Auto-derive depot from selected route's start location
        depot_name = self._derive_depot_from_route(route_id)
        bus_data['depot'] = depot_name

        try:
            updated_bus = self.bus_repo.update(bus_id, bus_data, commit=False)

            active_assignment = self.assignment_repo.get_active_by_bus(bus_id)
            if active_assignment:
                self.assignment_repo.update(active_assignment.assignment_id, {
                    'route_id': route_id,
                    'driver_id': driver_id,
                    'assigned_date': date.today(),
                    'status': 'Active'
                }, commit=False)
            else:
                active_assignment = self.assignment_repo.create({
                    'bus_id': bus_id,
                    'route_id': route_id,
                    'driver_id': driver_id,
                    'assigned_date': date.today(),
                    'status': 'Active'
                }, commit=False)

            if user_id and updated_bus:
                self.activity_repo.create({
                    'user_id': user_id,
                    'activity': f"Bus {updated_bus.bus_number} details and route/driver assignment were updated."
                })

            db.session.commit()

            summary = self.get_summary()

            try:
                if updated_bus:
                    self.websocket_service.emit_bus_updated(updated_bus.to_dict())
                if active_assignment:
                    self.websocket_service.emit_bus_assignment_updated(active_assignment.to_dict())
                self.websocket_service.emit_bus_summary_updated(summary)
            except Exception:
                pass

            return {
                'busId': bus_id,
                'assignmentId': active_assignment.assignment_id,
                'routeId': route_id,
                'driverId': driver_id,
                'depot': depot_name
            }

        except SQLAlchemyError as error:
            db.session.rollback()
            raise BusServiceError("Failed to update bus details and assignment.", status_code=500) from error

    def deactivate_bus(self, bus_id, user_id=None):
        bus_model = self.bus_repo.get_by_id(bus_id)
        if not bus_model:
            raise BusServiceError("Bus not found", status_code=404)

        if bus_model.status == "Inactive":
            raise BusServiceError("This bus is already inactive.", status_code=409)

        previous_status = bus_model.status

        try:
            # 1. Update bus status to Inactive
            self.bus_repo.update(bus_id, {'status': 'Inactive'}, commit=False)

            # 2. Cancel active assignment if present
            active_assignment = self.assignment_repo.get_active_by_bus(bus_id)
            cancelled_assignment = False
            if active_assignment:
                self.assignment_repo.update(active_assignment.assignment_id, {
                    'status': 'Cancelled'
                }, commit=False)
                cancelled_assignment = True

            # 3. Log activity
            if user_id:
                self.activity_repo.create({
                    'user_id': user_id,
                    'activity': f"Bus {bus_model.bus_number} was deactivated. Status changed from {previous_status} to Inactive."
                }, commit=False)

            # 4. Commit transaction
            db.session.commit()

            deactivate_payload = {
                'busId': bus_id,
                'busNumber': bus_model.bus_number,
                'previousStatus': previous_status,
                'currentStatus': 'Inactive',
                'cancelledAssignment': cancelled_assignment
            }

            # 5. Emit WebSocket events AFTER successful commit
            summary = self.get_summary()
            try:
                self.websocket_service.emit_bus_deactivated(deactivate_payload)
                self.websocket_service.emit_bus_summary_updated(summary)
                if cancelled_assignment:
                    self.websocket_service.emit_bus_assignment_updated({'busId': bus_id, 'cancelled': True})
                self.websocket_service.emit_recent_activity_created({
                    'user_id': user_id,
                    'activity': f"Bus {bus_model.bus_number} was deactivated."
                })
            except Exception:
                pass

            return deactivate_payload

        except SQLAlchemyError as error:
            db.session.rollback()
            raise BusServiceError("Unable to deactivate the bus at the moment.", status_code=500) from error
